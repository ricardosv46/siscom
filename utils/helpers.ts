export const cleanTextStringAndFormat = (text: string = '') => {
  if (text == null || text == '') {
    return text
  }

  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const convertNumber = (number: string, decimals?: number) => {
  let inputValue = number
  inputValue = inputValue.replace(/[^\d.]/g, '')
  const parts = inputValue.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (parts.length > 1) {
    parts[1] = parts[1].slice(0, decimals ?? 2)
  }
  const formattedValue = parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0]

  return formattedValue
}
