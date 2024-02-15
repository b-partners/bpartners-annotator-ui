import { AnnotatorCanvas } from '../lib';
import image from '../src/assets/image.png';

function App() {
  return (
    <div>
      <AnnotatorCanvas height='70vh' width='60vw' addPolygone={() => {}} polygoneList={[]} image={image} />
    </div>
  );
}

export default App;
