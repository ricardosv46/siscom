import { IReferences } from "@framework/types";
import { FC, ReactNode, useState, memo } from "react";
import Child from "./Child";

interface IPropsItem {
  references: IReferences;
  children?: ReactNode;
  space: number;
  onSelectedValue: (item: IReferences) => void;
}
const SubChild: FC<IPropsItem> = ({ references, children, space = 0, onSelectedValue }) => {
  const [active, setActive] = useState<boolean>(false);
  const onSelected = (references: IReferences) => {
    setActive(!active);
    onSelectedValue(references);
  };
  return (
    <div style={{ marginLeft: space }}>
      <div style={{ flexDirection: "column" }}>
        <Child item={references} onClick={() => onSelected(references)}>
          {active && children}
        </Child>
      </div>
    </div>
  );
};
export default memo(SubChild);
