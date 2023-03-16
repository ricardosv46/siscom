export const cleanTextStringAndFormat = (text: string = '') => {
  if(text == null || text == ''){
    return text;
  }

  return text.normalize('NFD').replace(/[\u0300-\u036f]/g,"")
}