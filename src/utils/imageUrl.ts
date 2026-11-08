export function getImageUrl(name: string, ext = 'jpg'): string {
  const path = new URL('@/assets/images/', import.meta.url).href
  return `${path}/${name}.${ext}`
}
