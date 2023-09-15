import { IAnexos } from "@framework/types";
import { useState } from "react";

const AnexoItem = ({ getAnexosDetail, item, level = 0 }: { item: IAnexos; level?: number; getAnexosDetail: (props: any) => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  const paddingLeft = `${level + 14}px`;

  const toggleOpen = () => {
    getAnexosDetail(item);
    setIsOpen(!isOpen);
  };

  return (
    <button style={{ paddingLeft }} className="flex flex-col">
      <div className="flex gap-1" onClick={toggleOpen}>
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

        <p className="fl" style={{ fontSize: "15px" }}>
          {item?.document_type} {item?.document} - {item.from}
        </p>
      </div>
      {isOpen &&
        item.references &&
        item.references.map((refItem: any, index: any) => (
          <AnexoItem key={index} item={refItem} getAnexosDetail={getAnexosDetail} level={level + 1} />
        ))}
    </button>
  );
};

export default AnexoItem;
