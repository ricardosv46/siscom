import { Modal } from 'antd'

export const modalInfo = (title?: string, message?: string) => {
  return Modal.info({
    title: title ? title : null,
    content: (
      <div>
        <p>{message}</p>
      </div>
    ),
    okButtonProps: { hidden: true },
    centered: true
  })
}

export const modalOnlyConfirm = (title?: string, message?: string, confirm?: () => void) => {
  const instance = Modal.info({
    title: title ? title : null,
    content: (
      <div>
        <p>{message}</p>
      </div>
    ),
    onOk() {
      instance.destroy()
      if (confirm) {
        confirm()
      }
    },
    okButtonProps: { style: { backgroundColor: '#0874cc' } },
    centered: true
  })
  return instance
}

export const modalConfirm = (title?: string, message?: string, confirm?: () => void, cancel?: () => void) => {
  const instance = Modal.confirm({
    icon: '',
    title: title ? title : null,
    content: (
      <div>
        <p>{message}</p>
      </div>
    ),
    okText: 'Si',
    cancelText: 'No',
    async onOk() {
      instance.destroy()
      if (confirm) {
        confirm()
      }
    },
    async onCancel() {
      instance.destroy()
      if (cancel) {
        cancel()
      }
    },
    okButtonProps: { style: { backgroundColor: '#0874cc' } },
    centered: true
  })
  return instance
}
