import { Input, InputProps } from 'antd'
import React, { ChangeEvent, ChangeEventHandler } from 'react'
import { Controller, ControllerRenderProps } from 'react-hook-form'

interface FormInputProps extends InputProps {
  control: any
  error?: boolean
  helperText?: string
  placeholder: string
  name: string
  type?: 'password' | 'text'
  setter?: (value: string) => void
  replace?: (value: string) => string
}

export const FormInput = ({ control, error, helperText, placeholder, name, type = 'text', replace, setter, ...res }: FormInputProps) => {
  const onChange = (value: string, field: ControllerRenderProps) => {
    const newValue = replace ? replace(value) : value
    if (setter) setter(newValue)

    return field.onChange(newValue)
  }
  return (
    <>
      {type === 'text' && (
        <>
          <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                size="large"
                placeholder={placeholder}
                {...field}
                onChange={(e) => onChange(e.target.value, field)}
                status={error ? 'error' : ''}
                {...res}
              />
            )}
          />
          {helperText && <p className="text-red-500">{helperText}</p>}
          {!helperText && <p className="py-3 "></p>}
        </>
      )}
      {type === 'password' && (
        <>
          <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input.Password size="large" placeholder={placeholder} {...field} status={error ? 'error' : ''} {...res} />
            )}
          />
          {helperText && <p className="text-red-500">{helperText}</p>}
          {!helperText && <p className="py-3 "></p>}
        </>
      )}
    </>
  )
}
