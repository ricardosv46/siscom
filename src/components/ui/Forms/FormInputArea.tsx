import { Input, InputProps } from 'antd'
import TextArea, { TextAreaProps } from 'antd/es/input/TextArea'
import React from 'react'
import { Controller, ControllerRenderProps } from 'react-hook-form'

interface FormInputProps extends TextAreaProps {
  control: any
  error: boolean
  helperText: string
  placeholder: string
  name: string
  type?: 'password' | 'text' | 'area'
  setter?: (value: string) => void
  replace?: (value: string) => string
}

export const FormInputArea = ({
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
    <div className="relative">
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => <TextArea size="large" placeholder={placeholder} {...field} status={error ? 'error' : ''} {...res} />}
      />
      {helperText && <p className="absolute left-0 text-red-500 -bottom-6">{helperText}</p>}
    </div>
  )
}
