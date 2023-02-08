import { FC, useEffect, useState } from 'react';
import { Drawer } from 'antd';
import { useUI } from '../context';
import ModalListadopas from '../ModalListadopas';

const ModalDrawer:FC = () =>{
  const { closeModal, displayModal, modalView, setEditId, editID } = useUI()
  const [ open, setOpen] = useState(false)
  const [ title, setTitle ] = useState('')

  useEffect(()=>{
    if(displayModal){
      setOpen(true)
      modalView === 'LISTADOPAS_VIEW' && ( editID ? setTitle('Editar PAS') : '' )
    }else{
      setOpen(false);
    }
  },[displayModal, editID])

  const onClose = () => {
    closeModal()
    setEditId('')
  };
  return (
    <Drawer
        title={title}
        width={550}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        { modalView === 'LISTADOPAS_VIEW' && <ModalListadopas onClose={onClose} /> }
    </Drawer>
  )
}

export default ModalDrawer