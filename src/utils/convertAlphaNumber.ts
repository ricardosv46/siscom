export const convertAlphaNumber = (str: string) => {
    let inputValue = str
    inputValue = inputValue.replace(/[^a-zA-Z0-9\s\/-]/g, '') // Se agrega \s para permitir espacios en blanco
    const parts = inputValue.split('.')
    return parts[0]
  }