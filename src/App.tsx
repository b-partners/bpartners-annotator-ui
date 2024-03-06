import { useState } from 'react';
import { AnnotatorCanvas } from '../lib';
import { Polygon } from '../lib/types';
import image from '../src/assets/Rennes_Solar_Panel_Batch_1_519355_363821.jpg';

function App() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);

  return (
    <div>
      <AnnotatorCanvas
        polygonLineSizeProps={{
          showLineSize: true,
          imageName: 'Rennes_Solar_Panel_Batch_1_519355_363821.jpg',
        }}
        height='70vh'
        width='60vw'
        setPolygons={setPolygons}
        polygonList={polygons}
        image={image}
        allowAnnotation
      />
    </div>
  );
}

export default App;
