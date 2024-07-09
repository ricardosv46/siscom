import { Input, InputNumber, InputNumberProps } from 'antd'
import React, { ChangeEvent, ChangeEventHandler } from 'react'
import { Controller, ControllerRenderProps } from 'react-hook-form'

interface FormInputProps extends InputNumberProps {
  control: any
  error: boolean
  helperText: string
  placeholder: string
  name: string
  type?: 'password' | 'text'
  setter?: (value: string) => void
  replace?: (value: string) => string
}

export const FormInputNumber = ({ control, error, helperText, placeholder, name, replace, setter, ...res }: FormInputProps) => {
  return (
    <div className="relative">
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <InputNumber
            size="large"
            placeholder={placeholder}
            {...field}
            onChange={(value) => field.onChange(value)}
            status={error ? 'error' : ''}
            {...res}
          />
        )}
      />
      {helperText && <p className="absolute left-0 text-red-500 -bottom-6">{helperText}</p>}
    </div>
  )
}
