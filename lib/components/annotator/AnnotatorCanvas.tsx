import { FC, useRef } from 'react';
import { AnnotatorCanvasProps } from '.';
import { TopBar, useImageCreation } from '../..';
import { Canvas } from '../canvas';
import { ElementProvider, PolygonProvider, PositionsProvider } from '../providers';
import { SizesProvider } from '../providers/SizesProvider';
import style from './style.module.css';

export const AnnotatorCanvas: FC<AnnotatorCanvasProps> = props => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { height, width, addPolygone, polygoneList, allowAnnotation = false } = props;
  const image = useImageCreation(props.image);

  return (
    <ElementProvider containerRef={containerRef} image={image}>
      {image.src.length > 0 && (
        <SizesProvider>
          <PositionsProvider>
            <div style={{ width }}>
              <TopBar />
              <div style={{ height, width }} className={style.container} ref={containerRef}>
                <PolygonProvider allowAnnotation={allowAnnotation} addPolygons={addPolygone} polygons={polygoneList}>
                  <Canvas />
                </PolygonProvider>
              </div>
            </div>
          </PositionsProvider>
        </SizesProvider>
      )}
    </ElementProvider>
  );
};
