import { useSizesContext } from '../..';
import { useDrawStaticImage } from '../../hooks/use-draw-static-image';

export const Canvas = () => {
  const { canvasHeight, canvasWidth } = useSizesContext();
  const canvasRef = useDrawStaticImage();

  return (
    <div
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
    >
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
    </div>
  );
};
