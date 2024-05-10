import { DatePicker, DatePickerProps } from 'antd'
import { Controller } from 'react-hook-form'

interface FormInputProps extends DatePickerProps {
  control: any
  error: boolean
  helperText: string
  placeholder: string
  name: string
  type?: 'password' | 'text'
  setter?: (value: string) => void
  replace?: (value: string) => string
}

export const FormDatePicker = ({
  control,
  error,
  helperText,
  placeholder,
  name,
  type = 'text',
  replace,
  setter,
  ...res
}: FormInputProps) => {
  return (
    <div>
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
      {helperText && <p className="text-red-500">{helperText}</p>}
      {!helperText && <p className="py-3 "></p>}
    </div>
  )
}
