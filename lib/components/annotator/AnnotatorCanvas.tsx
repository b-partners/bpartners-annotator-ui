import { FC, useRef } from "react";
import { AnnotatorCanvasProps } from ".";
import { useImageCreation } from "../..";
import { ElementProvider } from "../providers";

export const AnnotatorCanvas: FC<AnnotatorCanvasProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { height, width } = props;
  const image = useImageCreation(props.image);

  return (
    <ElementProvider containerRef={containerRef} image={image}>
      <div style={{ height, width }} ref={containerRef}></div>
    </ElementProvider>
  );
};
