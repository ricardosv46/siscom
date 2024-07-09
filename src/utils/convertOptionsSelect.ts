import { ListadoPas } from '@interfaces/listadoPas'

export const isLess2022 = (electoralProcess: string) => {
  return new Date(electoralProcess).valueOf() < new Date('2022').valueOf()
}

export const convertOptionsSelect = <T>(array: T[], value: keyof T, label: keyof T, seleccione?: string) => {
  const data = array.map((item) => ({ value: item[value], label: item[label] }))
  if (seleccione) return [{ value: '', label: seleccione }, ...data]
  return [...data]
}

export const convertOptionsSelectResponsible = (array: ListadoPas[], electoralProcess: string) => {
  const arrayData = Array.from(new Set(array.map((item) => item.responsable)))
    .map((responsable) => ({
      value: responsable,
      label: responsable
    }))
    .filter((item) => item.value !== '')
  const dataFill = [{ value: 'all', label: 'Todos' }, ...arrayData, { value: '', label: 'Sin Responsable' }]

  const data = isLess2022(electoralProcess) ? dataFill : dataFill.slice(0, -1)

  return data
}
