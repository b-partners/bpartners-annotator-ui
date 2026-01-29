import { useState } from 'react';
import { AnnotatorCanvas } from '../lib';
import { Polygon, PolygonColor } from '../lib/types';
import image from '../src/assets/Rennes_Solar_Panel_Batch_1_519355_363821.jpg';

const POLYGON_COLORS: PolygonColor[] = [
  { fillColor: '#0E4EB340', strokeColor: '#0E4EB3' },
  { fillColor: '#8A2BE240', strokeColor: '#8A2BE2' },
  { fillColor: '#00ff0040', strokeColor: '#00ff00' },
  { fillColor: '#2196F340', strokeColor: '#2196F3' },
  { fillColor: '#FFC10740', strokeColor: '#FFC107' },
  { fillColor: '#FF572240', strokeColor: '#FF5722' },
  { fillColor: '#E91E6340', strokeColor: '#E91E63' },
  { fillColor: '#00BCD440', strokeColor: '#00BCD4' },
  { fillColor: '#CDDC3940', strokeColor: '#CDDC39' },
  { fillColor: '#331E0A40', strokeColor: '#331E0A' },
];

const getNewPolygonColor = (polygons: Polygon[]) => {
  const index = polygons.length % POLYGON_COLORS.length;
  return POLYGON_COLORS[index];
};

function App() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const markerPosition = { x: 209, y: 328 };

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
        zoom={20}
        markerPosition={markerPosition}
        getNewPolygonColor={getNewPolygonColor}
        measurementMapper={(measurement, currentPolygons = []) => {
          return { ...measurement, isInvisible: currentPolygons[0]?.id !== measurement.polygonId };
        }}
        pointRadius={2}
        closeOnNear={false}
      />
    </div>
  );
}

export default App;
