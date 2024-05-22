import { FC, useRef } from 'react';
import { AnnotatorCanvasProps } from '.';
import { TopBar, useImageCreation } from '../..';
import { Canvas } from '../canvas';
import { ElementProvider, PolygonProvider, PositionsProvider } from '../providers';
import { SizesProvider } from '../providers/SizesProvider';
import style from './style.module.css';

export const AnnotatorCanvas: FC<AnnotatorCanvasProps> = props => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { height, width, setPolygons, polygonList, allowAnnotation = false, polygonLineSizeProps: polygonSizeProps, buttonsComponent, zoom } = props;
  const { imageName = '', showLineSize = false, converterApiUrl = '' } = polygonSizeProps || {};
  const { image, isImageLoading } = useImageCreation(props.image, imageName);

  return (
    <ElementProvider containerRef={containerRef} image={image}>
      {image.src.length > 0 ? (
        <SizesProvider>
          <PositionsProvider>
            <div style={{ width }}>
              <TopBar buttonsComponent={buttonsComponent} />
              <div style={{ height, width }} className={style.container} ref={containerRef}>
                <PolygonProvider
                  converterApiUrl={converterApiUrl}
                  showLineSize={showLineSize}
                  allowAnnotation={allowAnnotation}
                  setPolygons={setPolygons}
                  polygons={polygonList}
                  zoom={zoom}
                >
                  <Canvas />
                  {isImageLoading && (
                    <div style={{ height, width }} className={style.loadingContainer}>
                      <div></div>
                    </div>
                  )}
                </PolygonProvider>
              </div>
            </div>
          </PositionsProvider>
        </SizesProvider>
      ) : (
        isImageLoading && (
          <div style={{ height, width }} className={style.loadingContainer}>
            <div></div>
          </div>
        )
      )}
    </ElementProvider>
  );
};
