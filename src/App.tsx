import { useState } from 'react';
import { AnnotatorCanvas } from '../lib';
import { Polygon } from '../lib/types';
import image from '../src/assets/Rennes_Solar_Panel_Batch_1_519355_363821.jpg';
import { CustomButtons } from './components/CustomButtons';

function App() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);

  return (
    <div>
      <AnnotatorCanvas
        polygonLineSizeProps={{
          showLineSize: true,
          imageName: 'Rennes_Solar_Panel_Batch_1_519355_363821.jpg',
          converterApiUrl: process.env.REACT_APP_ANNOTATOR_GEO_CONVERTER_API_URL || '',
        }}
        height='70vh'
        width='60vw'
        setPolygons={setPolygons}
        polygonList={polygons}
        image={image}
        allowAnnotation
        buttonsComponent={CustomButtons}
        zoom={20}
      />
    </div>
  );
}

export default App;
