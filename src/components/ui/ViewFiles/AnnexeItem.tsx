import { IconArrow } from '@components/icons/IconArrow'
import { IconClip } from '@components/icons/IconClip'
import { IconCloseFile } from '@components/icons/IconCloseFile'
import { IconOpenFile } from '@components/icons/IconOpenFile'
import { Annexe, AnnexeDetail, ReqAnnexeDetail } from '@interfaces/listadoPas'
import { useState } from 'react'

interface Props {
  item: Annexe
  level?: number
  mutateGetAnnexesDetail: (payload: ReqAnnexeDetail) => void
  annexeDetail: AnnexeDetail[]
}

export const AnnexeItem = ({ mutateGetAnnexesDetail, item, level = 0, annexeDetail }: Props) => {
  const [isOpen, setIsOpen] = useState(true)
  const paddingLeft = `${level + 14}px`
  const id = item.id

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState)
  }

  const toogleDetail = async () => {
    mutateGetAnnexesDetail({ nu_ann: item.nu_ann!, nu_emi_ref: item.nu_emi_ref!, id })
  }

  const isSelected = id === annexeDetail[0]?.id

  return (
    <div style={{ paddingLeft }} className="flex flex-col">
      <div className="flex items-center gap-1">
        <button onClick={toggleOpen}>{item.references?.length! > 0 && <IconArrow className={`${isOpen ? 'rotate-90' : ''}`} />}</button>
        <div className="w-6 h-6">
          {item.references?.length! > 0 ? isOpen ? <IconOpenFile className="text-less_6_months" /> : <IconCloseFile /> : <IconClip />}
        </div>

        <p style={{ backgroundColor: isSelected ? '#fffbc5' : '', fontSize: '15px', cursor: 'pointer' }} onClick={toogleDetail}>
          {item?.document_type} {item?.document} - {item.from}
        </p>
      </div>
      {isOpen &&
        item.references &&
        item.references.map((refItem: any, index: any) => (
          <AnnexeItem
            key={index}
            item={refItem}
            mutateGetAnnexesDetail={mutateGetAnnexesDetail}
            level={level + 1}
            annexeDetail={annexeDetail}
          />
        ))}
    </div>
  )
}
