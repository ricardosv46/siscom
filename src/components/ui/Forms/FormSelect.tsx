import { Select, SelectProps } from 'antd'
import { Controller, ControllerRenderProps } from 'react-hook-form'

interface FormSelectProps extends SelectProps {
  control?: any
  error?: boolean
  helperText?: string
  placeholder?: string
  name: string
  type?: 'password' | 'text'
  setter?: (value: string) => void
}

export const FormSelect = ({ control, error, helperText, placeholder, name, type = 'text', setter, ...res }: FormSelectProps) => {
  const onChange = (value: string, field: ControllerRenderProps) => {
    if (setter) setter(value)
    return field.onChange(value)
  }

  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select
            size="large"
            placeholder={placeholder}
            {...field}
            onChange={(e) => onChange(e, field)}
            status={error ? 'error' : ''}
            {...res}
          />
        )}
      />
      {helperText && <p className="text-red-500">{helperText}</p>}
      {!helperText && <p className="py-3"></p>}
    </div>
  )
}
