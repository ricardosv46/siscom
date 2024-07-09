import { DatePicker, DatePickerProps } from 'antd'
import { Controller } from 'react-hook-form'

interface FormInputProps extends DatePickerProps {
  control: any
  error?: boolean
  helperText?: string
  placeholder: string
  name: string
  setter?: (value: string) => void
  replace?: (value: string) => string
}

export const FormDatePicker = ({ control, error, helperText, placeholder, name, replace, setter, ...res }: FormInputProps) => {
  return (
    <div className="relative w-full">
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <DatePicker
            size="large"
            placeholder={placeholder}
            {...res}
            {...field}
            onChange={(value) => field.onChange(value)}
            status={error ? 'error' : ''}
          />
        )}
      />
      {helperText && <p className="absolute left-0 text-red-500 -bottom-6">{helperText}</p>}
    </div>
  )
}
