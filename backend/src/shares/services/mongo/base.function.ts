import { ObjectId } from 'src/shares/models/base.model'

export const convertObjectIds = (ids: string[]) => {
  let idObjectIds = []
  if (ids && ids.length > 0) {
    ids.forEach((item) => {
      try {
        idObjectIds.push(new ObjectId(item))
      } catch (error) {}
    })
  }
  return idObjectIds
}

export const distinctArray = (array: any[]) => {
  const uniqueArray = []
  for (let i = 0; i < array.length; i++) {
    if (uniqueArray.indexOf(array[i]) === -1 && array[i] != null) {
      uniqueArray.push(array[i])
    }
  }
  return uniqueArray
}
