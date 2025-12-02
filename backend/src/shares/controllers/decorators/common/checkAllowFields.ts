export function checkAllowFields(allowFields: string[], requestFieldsObject: object): boolean {
  try {
    const requestFields = Object.keys(requestFieldsObject);
    let result = true;
    requestFields.forEach((requestField: string) => {
      if (!allowFields.includes(requestField)) {
        result = false;
      }
    });
    return result;
  } catch (error) {
    return false;
  }
}
