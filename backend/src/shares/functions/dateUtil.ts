import moment from 'moment'

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export const dateBetween = (date: Date, [startDate, endDate]: Date[]) => {
  const start = moment(startDate)
  const end = moment(endDate)
  const checkMoment = moment(date)
  return checkMoment.isBetween(start, end, null, '[]') || false
}
