import { ITracking, ITrackingDetail } from "@framework/types";
import { useState } from "react";

const TrackingItem = ({
  getTrackingDetail,
  item,
  level = 0,
  tackingDetail,
}: {
  item: ITracking;
  level?: number;
  getTrackingDetail: (props: ITracking) => void;
  tackingDetail: ITrackingDetail[];
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const paddingLeft = `${level + 14}px`;
  const id = `${level}-${item.document}`;

  const toggleOpen = () => {
    // getAnexosDetail({ id, ...item });
    setIsOpen((prevState) => !prevState);
  };

  const toogleDetail = async () => {
    getTrackingDetail({ id, ...item });
    // setIsOpen((prevState) => !prevState);
  };

  const isSelected = id === tackingDetail[0].id;

  return (
    <button style={{ paddingLeft }} className="flex flex-col">
      <div className="flex gap-1">
        <button onClick={toggleOpen}>
          {item.references?.length! > 0 && <img src="assets/images/arrow.svg" alt="Arrow" className={`${isOpen ? "rotate-90" : ""}`} />}
        </button>

        {item.references?.length! > 0 ? (
          isOpen ? (
            <img src="assets/images/abrir.svg" alt="Abrir" />
          ) : (
            <img src="assets/images/cerrar_archivo.svg" alt="Cerrar" />
          )
        ) : (
          <img src="assets/images/clip.svg" alt="Clip" />
        )}

        <p style={{ backgroundColor: isSelected ? "#fffbc5" : "", fontSize: "15px" }} onClick={toogleDetail}>
          {item?.document_type} {item?.document} - {item.from}
        </p>
      </div>
      {isOpen &&
        item.references &&
        item.references.map((refItem: any, index: any) => (
          <TrackingItem key={index} item={refItem} getTrackingDetail={getTrackingDetail} level={level + 1} tackingDetail={tackingDetail} />
        ))}
    </button>
  );
};

export default TrackingItem;
