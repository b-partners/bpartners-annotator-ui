import { FC, useEffect, useMemo, useState } from 'react';
import { SizesProviderProps } from '.';
import { SizesContext, UrlParams, useElementContext, useScale } from '../..';
import { IMAGE_MARGIN, SCALE_DELTA_QUERY_NAME } from '../../constant';

export const SizesProvider: FC<SizesProviderProps> = props => {
  const { children } = props;
  const { containerHeight, containerWidth, defaultScale, scaleLimit } = useScale();
  const { image, containerRef } = useElementContext();
  // Restore the user's manual zoom delta from the URL so it survives a remount;
  // it only changes again when the user uses the zoom buttons.
  const [scale, setScale] = useState(() => +(UrlParams.get(SCALE_DELTA_QUERY_NAME) ?? '0'));
  const [isMoving, setIsMoving] = useState(false);

  const canvasHeight = useMemo(() => Math.round((image.height + IMAGE_MARGIN) * (defaultScale + scale)), [defaultScale, image.height, scale]);

  const canvasWidth = useMemo(() => Math.round((image.width + IMAGE_MARGIN) * (defaultScale + scale)), [defaultScale, image.width, scale]);

  useEffect(() => {
    UrlParams.set('scale', (defaultScale + scale).toFixed(2));
    UrlParams.set(SCALE_DELTA_QUERY_NAME, scale.toFixed(2));

    if (containerRef.current) {
      const currentContainer = containerRef.current;
      const middleY = (currentContainer.scrollHeight - currentContainer.clientHeight) / 2;
      const middleX = (currentContainer.scrollWidth - currentContainer.clientWidth) / 2;
      containerRef.current.scrollTo({
        left: middleX,
        top: middleY,
        behavior: 'auto',
      });
    }
  }, [defaultScale, scale, containerRef]);

  return (
    <SizesContext.Provider
      value={{
        canvasHeight,
        canvasWidth,
        containerHeight,
        containerWidth,
        defaultScale,
        scale: scale + defaultScale,
        setScale,
        scaleLimit,
        isMoving,
        toggleIsMoving: () => setIsMoving(p => !p),
      }}
    >
      {children}
    </SizesContext.Provider>
  );
};
