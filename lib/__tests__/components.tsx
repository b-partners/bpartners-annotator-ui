import { useState } from 'react';
import { AnnotatorCanvas, Polygon } from '..';
import image from '../../src/assets/image.png';

export const Annotator = () => {
  const [state, setState] = useState<Polygon[]>([]);
  return <AnnotatorCanvas polygonList={state} setPolygons={setState} allowAnnotation height='70vh' width='60vw' image={image} />;
};
