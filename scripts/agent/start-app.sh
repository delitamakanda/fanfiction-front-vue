#!/usr/bin/env bash
# Démarre l'app complète pour les agents, en arrière-plan :
#   1. l'API Django (dépôt delitamakanda/fanfiction) sur 127.0.0.1:8000, avec
#      son propre scripts/agent/start-app.sh : base SQLite jetable, données de
#      `manage.py seed_demo`, `runserver` ;
#   2. ce front Vue (`vite` en mode dev) sur http://localhost:5173, branché sur
#      cette API. Vite recharge la page à chaque modification de code.
# Attend que les deux répondent. Logs dans .agent-out/backend.log et
# .agent-out/vite.log.
#
# Le backend est attendu dans $BACKEND_DIR (défaut : .agent-out/backend). En CI,
# le workflow le récupère avec actions/checkout et installe ses dépendances
# Python ; en local, le script le clone s'il est absent (BACKEND_REF : branche,
# défaut main) — installe alors toi-même `pip install -r requirements-dev.txt`
# dans ce dossier.
#
# Prérequis : npm ci --legacy-peer-deps
set -euo pipefail

root=$PWD
out=.agent-out
backend="${BACKEND_DIR:-$out/backend}"
mkdir -p "$out/playwright" "$out/api"

if [ ! -f "$backend/manage.py" ]; then
  git clone --depth 1 --branch "${BACKEND_REF:-main}" \
    https://github.com/delitamakanda/fanfiction "$backend"
fi

# Démarre l'API avec le script du backend (même procédure que ses propres agents).
# Ses variables (DEBUG, DATABASE_URL…) visent le backend : on ne les propage pas
# au front, d'où un GITHUB_ENV temporaire.
(
  cd "$backend"
  GITHUB_ENV="" START_TIMEOUT="${START_TIMEOUT:-120}" bash scripts/agent/start-app.sh
) > "$out/backend.log" 2>&1 || { tail -n 60 "$out/backend.log"; echo "::error::l'API n'a pas démarré"; exit 1; }

# Le CORS du backend n'accepte que l'origine http://localhost:5173 : le front
# doit tourner sur ce port précis (--strictPort) et être ouvert via « localhost ».
export VITE_APP_BASE_API_URL=http://127.0.0.1:8000/api
if [ -n "${GITHUB_ENV:-}" ]; then
  echo "VITE_APP_BASE_API_URL=$VITE_APP_BASE_API_URL" >> "$GITHUB_ENV"
fi
cd "$root"
nohup npx vite --host localhost --port 5173 --strictPort > "$out/vite.log" 2>&1 < /dev/null &

if ! timeout "${START_TIMEOUT:-120}" bash -c \
  'until curl -sf http://localhost:5173/ >/dev/null; do sleep 2; done'; then
  echo "::error::le front n'a pas démarré à temps"
  tail -n 50 "$out/vite.log"
  exit 1
fi
echo "Front prêt : http://localhost:5173 (API : http://127.0.0.1:8000/api/)"
echo "Comptes : demo-admin (staff) / demo-author / demo-reader, mot de passe demo-password-123"
