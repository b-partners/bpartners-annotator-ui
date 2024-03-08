import { useEffect, useState } from 'react';

export const useImageCreation = (src: string, name: string) => {
  const [image, setImage] = useState<HTMLImageElement>(new Image());
  const [isImageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setImageLoading(false);
    };
    img.src = src;
    img.ariaLabel = name;
  }, [src, name]);

  return { image, isImageLoading };
};
