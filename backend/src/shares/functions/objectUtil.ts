export const compareKeyTwoObject = (obj1: object, obj2: object) => {

  if (!obj1 || !obj2 || Object.keys(obj1).length != Object.keys(obj2).length || Object.keys(obj1).length == 0 || Object.keys(obj2).length == 0) {
    return false;
  }

  let sortedKeyObj1 = {};
  let sortedKeyObj2 = {};
  Object.keys(obj1).sort().forEach(function (key) {
    sortedKeyObj1[key] = key;
  });
  Object.keys(obj2).sort().forEach(function (key) {
    sortedKeyObj2[key] = key;
  });

  if (JSON.stringify(sortedKeyObj1) !== JSON.stringify(sortedKeyObj2)) {
    return false;
  }
  return true;
}

export const splitListO = (list: any[], chunkSize: number) => {
  const result = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    result.push(list.slice(i, i + chunkSize));
  }
  return result;
}

export const isEmptyObject = (obj: any) => {
  if (!obj) {
    return false;
  }
  return Object.keys(obj).length === 0;
}
