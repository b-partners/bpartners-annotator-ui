import { useEffect, useRef } from "react";
import { useElementContext, useSizesContext } from "../..";

export const Canvas = () => {
  const { canvasHeight, canvasWidth, defaultScale } = useSizesContext();
  const { image } = useElementContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && image.src.length > 0 && image.src.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.drawImage(
        image,
        0,
        0,
        image.width * defaultScale,
        image.height * defaultScale,
      );
    }
  }, [canvasRef, image, defaultScale]);

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
