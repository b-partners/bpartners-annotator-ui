import { useEffect, useRef } from "react";
import { useElementContext, useImagePosition, useSizesContext } from "../..";

export const Canvas = () => {
  const { canvasHeight, canvasWidth, imageHeight, imageWidth } =
    useSizesContext();
  const { image } = useElementContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { imageX, imageY } = useImagePosition();

  useEffect(() => {
    if (canvasRef.current && image.src.length > 0 && image.src.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
    }
  }, [canvasRef, image, imageX, imageY, imageWidth, imageHeight]);

  return (
    <div
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      ></canvas>
    </div>
  );
};
