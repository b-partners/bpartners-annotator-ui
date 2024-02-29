import { useState } from 'react';
import { AnnotatorCanvas } from '../lib';
import image from '../src/assets/image.png';
import { Polygon } from '../lib/types';

function App() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);

  return (
    <div>
      <AnnotatorCanvas
        height='70vh'
        width='60vw'
        addPolygon={polygon => setPolygons(prev => [...prev, polygon])}
        polygonList={polygons}
        image={image}
        allowAnnotation
      />
    </div>
  );
}

export default App;
