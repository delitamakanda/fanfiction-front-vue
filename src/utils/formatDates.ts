export const formatDate = (date: string | undefined) => {
  return date ? new Date(date).toLocaleDateString('fr-FR') : ''
}
