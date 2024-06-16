import { ListadoPas, TypeDocument } from '@interfaces/listadoPas'
import { Button, Modal, Upload } from 'antd'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormInput } from '../Forms/FormInput'
import { FormSelect } from '../Forms/FormSelect'
import { convertOptionsSelect } from '@utils/convertOptionsSelect'
import { CloseOutlined, UploadOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { status } from '@services/processes'

interface ModalInhabilitarProps {
  selectedProcessModal: ListadoPas
  typeDocuments: TypeDocument[]
  isOpen: boolean
  close: () => void
  refetch: () => void
}

interface Form {
  motive: string
  file: null | File
  related_document: string
  document: string
}

export const ModalInhabilitar = ({ selectedProcessModal, typeDocuments, isOpen, close, refetch }: ModalInhabilitarProps) => {
  const { handleSubmit, control, watch, setValue, reset } = useForm<Form>({
    defaultValues: {
      motive: '',
      file: null,
      related_document: '',
      document: ''
    }
  })

  const handleCloseModal = () => {
    reset()
    close()
  }

  const beforeUpload = (file: File) => {
    // Puedes realizar validaciones o ajustes antes de cargar el archivo
    setValue('file', file)
    return false // Retornar false para evitar la carga automática
  }

  const { isPending, mutate: mutateStatus } = useMutation({
    mutationFn: status,
    onSuccess: (data) => {
      if (data.success) {
        reset()
        close()
        refetch()
      }
    }
  })

  const onSubmit: SubmitHandler<Form> = (data) => {
    const instance = Modal.confirm({
      icon: '',
      content: (
        <div>
          <p>¿Estás seguro de {selectedProcessModal?.estado === 'inactive' ? 'habilitar' : 'inhabilitar'} el Expediente?​</p>
        </div>
      ),
      okText: 'Si',
      cancelText: 'No',
      async onOk() {
        instance.destroy()
        mutateStatus({
          ...data,
          action: selectedProcessModal?.estado === 'inactive' ? 'HABILITAR' : 'INHABILITAR',
          id: selectedProcessModal?.numero!
        })
      },
      async onCancel() {
        instance.destroy()
      },
      okButtonProps: { style: { backgroundColor: '#0874cc' } },
      centered: true
    })
  }

  return (
    <Modal
      styles={{ body: { height: 350, width: 600 } }}
      width={'auto'}
      title={
        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {selectedProcessModal?.estado === 'inactive' ? 'Habilitar' : 'Inhabilitar'} Expediente
        </p>
      }
      centered
      open={isOpen}
      cancelButtonProps={{ hidden: true }}
      okButtonProps={{ hidden: true }}
      onCancel={handleCloseModal}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-10">
        <div className="flex items-center gap-5 ">
          <p className="w-[130px]">Motivo* :</p>
          <FormInput placeholder="Ingrese motivo" className="flex-1" name="motive" control={control} maxLength={250} />
        </div>
        <div className="flex items-center gap-5">
          <p className="w-[130px]">Tipo Documento:</p>
          <FormSelect
            className="flex-1"
            control={control}
            placeholder="Seleccione tipo de documento"
            name="related_document"
            options={convertOptionsSelect(typeDocuments, 'name', 'name', 'Seleccione tipo de documento')}
          />
        </div>
        <div className="flex items-center gap-5">
          <p className="w-[130px]">Nro. Documento :</p>
          <FormInput placeholder="Ingrese número de documento" className="flex-1" name="document" control={control} />
        </div>
        <div className="flex items-center gap-5">
          <p className="w-[130px]">Adjuntar archivo :</p>{' '}
          {!watch()?.file && (
            <Upload showUploadList={false} beforeUpload={beforeUpload}>
              {/* accept=".xls,.xlsx,.doc,.docx" */}
              <Button size="large" icon={<UploadOutlined />}>
                Seleccionar Archivo…
              </Button>
            </Upload>
          )}
          {watch()?.file && (
            <div className="flex items-center gap-5">
              <div className="flex w-[350px] max-h-[80px] overflow-auto">
                <p className=""> {watch()?.file?.name}</p>
              </div>
              <Button type="primary" className="p-0 px-2 " onClick={() => {}}>
                <CloseOutlined className="w-5 h-5 " />
              </Button>
            </div>
          )}
        </div>
        <button
          disabled={
            isPending ||
            !watch()?.motive?.trim() ||
            (!!watch()?.related_document && !watch()?.document?.trim()) ||
            (!!watch()?.document && !watch()?.related_document?.trim())
          }
          type="submit"
          className="mx-auto text-white disabled:bg-gray-300 bg-strong-blue w-[200px] py-2 mt-5">
          {selectedProcessModal?.estado === 'inactive' ? 'Habilitar' : 'Inhabilitar'}
        </button>
      </form>
    </Modal>
  )
}
