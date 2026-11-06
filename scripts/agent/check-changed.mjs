// Vérifications statiques limitées à ce que l'agent a modifié, par rapport à
// la branche de base. Le dépôt n'est pas encore propre (≈40 erreurs ESLint,
// ≈14 erreurs vue-tsc, ≈85 fichiers non formatés) : on ne bloque que sur les
// erreurs situées dans les lignes ajoutées ou modifiées (un fichier nouveau
// compte en entier), pour ne pas imposer à chaque ticket de réparer l'existant.
//
//   - ESLint (config du dépôt) : erreurs sur les lignes modifiées ;
//   - vue-tsc : tout le projet est typé (seule façon fiable de le faire), mais
//     seules les erreurs sur les lignes modifiées comptent ;
//   - Prettier : fichiers modifiés de src/ qui étaient déjà formatés sur la
//     branche de base, et nouveaux fichiers. Un fichier non formaté sur la base
//     n'est pas reformaté (cela noierait la revue sous un diff de style).
//
// Les déclarations générées par Vite (components.d.ts, auto-imports.d.ts,
// typed-router.d.ts), scripts/agent/ et .github/ sont ignorés.
//
// Usage : node scripts/agent/check-changed.mjs [--check|--fix]   (défaut : --check)
// Env   : BASE_REF (défaut : origin/main)

import { execFileSync, spawnSync } from 'node:child_process';

const mode = process.argv[2] ?? '--check';
const base = process.env.BASE_REF || 'origin/main';
const fix = mode === '--fix';
const CODE = /\.(vue|ts|tsx|mts|js|mjs|cjs)$/;
const IGNORED = /^(components|auto-imports|typed-router)\.d\.ts$|^(scripts\/agent|\.github)\//;

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 << 20 });
const npx = (args, opts = {}) =>
  spawnSync('npx', args, { encoding: 'utf8', maxBuffer: 64 << 20, ...opts });

const tracked = git('diff', '--name-only', '--diff-filter=ACMR', base, '--').split('\n');
const untracked = git('ls-files', '--others', '--exclude-standard').split('\n');
const files = [...new Set([...tracked, ...untracked])]
  .filter((f) => f && CODE.test(f) && !IGNORED.test(f))
  .sort();

if (!files.length) {
  console.log('Aucun fichier front modifié à vérifier.');
  process.exit(0);
}

// Lignes modifiées par fichier ; `true` = fichier entier (nouveau ou non suivi).
function changedLines(file) {
  if (untracked.includes(file)) return true;
  let diff;
  try {
    diff = git('diff', '-U0', base, '--', file);
  } catch {
    return true;
  }
  if (/^new file mode/m.test(diff)) return true;
  const ranges = [];
  for (const m of diff.matchAll(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(m[1]);
    const count = m[2] === undefined ? 1 : Number(m[2]);
    if (count > 0) ranges.push([start, start + count - 1]);
  }
  return ranges;
}
const lines = new Map(files.map((f) => [f, changedLines(f)]));
const touches = (file, line) => {
  const r = lines.get(file);
  return r === true || (Array.isArray(r) && r.some(([a, b]) => line >= a && line <= b));
};

console.log('Fichiers vérifiés :');
for (const f of files) console.log(`  ${f}${lines.get(f) === true ? ' (nouveau)' : ''}`);

let failed = false;

// Prettier — avant ESLint pour que --fix produise un fichier déjà formaté.
const srcFiles = files.filter((f) => f.startsWith('src/'));
const formattable = srcFiles.filter((f) => {
  if (lines.get(f) === true) return true;
  let original;
  try {
    original = git('show', `${base}:${f}`);
  } catch {
    return true;
  }
  return npx(['prettier', '--check', '--stdin-filepath', f], { input: original }).status === 0;
});
const skipped = srcFiles.filter((f) => !formattable.includes(f));
console.log('\n— Prettier');
if (skipped.length) {
  console.log(`Non vérifiés (déjà non formatés sur ${base}) : ${skipped.join(', ')}`);
}
if (formattable.length) {
  const r = npx(['prettier', fix ? '--write' : '--check', '--log-level', 'warn', ...formattable], {
    stdio: 'inherit',
  });
  if (r.status !== 0) failed = true;
  else console.log('OK');
}

// ESLint
console.log('\n— ESLint (lignes modifiées)');
const eslint = npx([
  'eslint',
  '--no-warn-ignored',
  '--format',
  'json',
  ...(fix ? ['--fix'] : []),
  ...files,
]);
let eslintErrors = 0;
let eslintIgnored = 0;
try {
  for (const res of JSON.parse(eslint.stdout)) {
    const file = res.filePath.slice(process.cwd().length + 1);
    for (const msg of res.messages) {
      if (msg.severity < 2) continue;
      if (msg.line === undefined || touches(file, msg.line)) {
        eslintErrors++;
        console.log(`${file}:${msg.line ?? 0}:${msg.column ?? 0}  ${msg.message}  (${msg.ruleId ?? 'eslint'})`);
      } else {
        eslintIgnored++;
      }
    }
  }
} catch {
  console.log(eslint.stdout, eslint.stderr);
  eslintErrors++;
}
if (eslintErrors) failed = true;
console.log(
  eslintErrors ? `${eslintErrors} erreur(s)` : 'OK',
  eslintIgnored ? `(${eslintIgnored} erreur(s) préexistante(s) hors des lignes modifiées, ignorées)` : '',
);

// vue-tsc
console.log('\n— vue-tsc (lignes modifiées)');
const tsc = npx(['vue-tsc', '--build', '--force', '--pretty', 'false']);
const tscOut = `${tsc.stdout}\n${tsc.stderr}`;
let tscIgnored = 0;
const tscErrors = [];
for (const line of tscOut.split('\n')) {
  const m = line.match(/^(.+?)\((\d+),\d+\): error TS/);
  if (!m) continue;
  if (lines.has(m[1]) && touches(m[1], Number(m[2]))) tscErrors.push(line);
  else tscIgnored++;
}
if (tscErrors.length) {
  failed = true;
  console.log([...new Set(tscErrors)].join('\n'));
} else {
  console.log(`OK (${tscIgnored} erreur(s) préexistante(s) ailleurs, ignorées)`);
}

process.exit(failed ? 1 : 0);
