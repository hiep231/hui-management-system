export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export const isEmptyString = (str: string) => {
  if (str.length === 0 || !str.trim()) {
    return true
  }
  return false
}
