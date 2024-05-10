export const onlyLetters = (value: string) => {
  const newValue = value.replace(/[^a-zA-Z]/g, '')
  return newValue
}
