import api from "@framework/api";
import { IAnexos, IAnexosDetail } from "@framework/types";
import { relative } from "path";
import { useState } from "react";

const AnexoItem = ({
  getAnexosDetail,
  item,
  level = 0,
  anexoDetail,
}: {
  item: IAnexos;
  level?: number;
  getAnexosDetail: (props: IAnexos) => void;
  anexoDetail: IAnexosDetail[];
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const paddingLeft = `${level + 14}px`;
  const id = `${level}-${item.document}`;

  const toggleOpen = async () => {
    getAnexosDetail({ id, ...item });
    setIsOpen((prevState) => !prevState);
  };

  const isSelected = id === anexoDetail[0].id;

  return (
    <div style={{ paddingLeft }} className="flex flex-col">
      <button className="flex gap-1 items-center" onClick={toggleOpen}>
        {item.references?.length! > 0 && <img src="assets/images/arrow.svg" alt="Arrow" className={`${isOpen ? "rotate-90" : ""}`} />}

        {item.references?.length! > 0 ? (
          isOpen ? (
            <img src="assets/images/abrir.svg" alt="Abrir" />
          ) : (
            <img src="assets/images/cerrar_archivo.svg" alt="Cerrar" />
          )
        ) : (
          <img src="assets/images/clip.svg" alt="Clip" />
        )}

        <p style={{ backgroundColor: isSelected ? "#fffbc5" : "", fontSize: "15px" }}>
          {item?.document_type} {item?.document} - {item.from}
        </p>
      </button>
      {isOpen &&
        item.references &&
        item.references.map((refItem: any, index: any) => (
          <AnexoItem key={index} item={refItem} getAnexosDetail={getAnexosDetail} level={level + 1} anexoDetail={anexoDetail} />
        ))}
    </div>
  );
};

export default AnexoItem;
