import { useState } from 'react'
type ToggleReturnType = [boolean, () => void, () => void, () => void]
const useToggle = (initialState = false): ToggleReturnType => {
  const [value, setValue] = useState(initialState)

  const toggle = () => {
    setValue(!value)
  }

  const open = () => {
    setValue(true)
  }

  const close = () => {
    setValue(false)
  }

  return [value, open, close, toggle]
}

export { useToggle }
