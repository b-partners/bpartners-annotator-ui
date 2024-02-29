import { useState } from 'react';
import { AnnotatorCanvas } from '../lib';
import { Polygon } from '../lib/types';
import image from '../src/assets/image.png';

function App() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);

  return (
    <div>
      <AnnotatorCanvas height='70vh' width='60vw' setPolygons={setPolygons} polygonList={polygons} image={image} allowAnnotation />
    </div>
  );
}

export default App;
