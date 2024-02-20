import { useState } from 'react';
import { AnnotatorCanvas } from '../lib';
import image from '../src/assets/image.png';
import { Polygon } from '../lib/types';

function App() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);

  return (
    <div>
      <AnnotatorCanvas height='70vh' width='60vw' addPolygone={polygon => setPolygons(prev => [...prev, polygon])} polygoneList={polygons} image={image} />
    </div>
  );
}

export default App;
