import { IconArrow } from '@components/icons/IconArrow'
import { IconClip } from '@components/icons/IconClip'
import { IconCloseFile } from '@components/icons/IconCloseFile'
import { IconOpenFile } from '@components/icons/IconOpenFile'
import { Annexe, ReqAnnexeDetail, TrackingDetail } from '@interfaces/listadoPas'
import { useState } from 'react'

interface Props {
  item: Annexe
  level?: number
  mutateGetTrackingDetail: (payload: ReqAnnexeDetail) => void
  trackingDetail: TrackingDetail[]
}

export const TrackingItem = ({ mutateGetTrackingDetail, item, level = 0, trackingDetail }: Props) => {
  const [isOpen, setIsOpen] = useState(true)
  const paddingLeft = `${level + 14}px`
  const id = item.id

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState)
  }

  const toogleDetail = async () => {
    mutateGetTrackingDetail({ nu_ann: item.nu_ann!, nu_emi: item.nu_emi!, id })
  }

  const isSelected = id === trackingDetail[0]?.id

  return (
    <div style={{ paddingLeft }} className="flex flex-col">
      <div className="flex items-center gap-1">
        <button onClick={toggleOpen}>{item.references?.length! > 0 && <IconArrow className={`${isOpen ? 'rotate-90' : ''}`} />}</button>
        <div className="w-6 h-6">
          {item.references?.length! > 0 ? isOpen ? <IconOpenFile className=" text-less_6_months" /> : <IconCloseFile /> : <IconClip />}
        </div>
        <p style={{ backgroundColor: isSelected ? '#fffbc5' : '', fontSize: '15px', cursor: 'pointer' }} onClick={toogleDetail}>
          {item?.document_type} {item?.document} - {item.from}
        </p>
      </div>
      {isOpen &&
        item.references &&
        item.references.map((refItem: any, index: any) => (
          <TrackingItem
            key={index}
            item={refItem}
            mutateGetTrackingDetail={mutateGetTrackingDetail}
            level={level + 1}
            trackingDetail={trackingDetail}
          />
        ))}
    </div>
  )
}
