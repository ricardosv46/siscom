import { Checkbox, CheckboxProps } from 'antd'

import { Controller, ControllerRenderProps } from 'react-hook-form'

interface FormCheckboxProps extends CheckboxProps {
  control?: any
  name: string
}

export const FormCheckbox = ({ control, name, ...res }: FormCheckboxProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => <Checkbox checked={res.value === field.value} onChange={(e) => field.onChange(e.target.value)} {...res} />}
    />
  )
}
