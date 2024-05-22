# Bpartners Annotator component

This is react library for rendering image and polygons using javascript's canvas.

# Features

- Show image preview from url or file
- Show polygons preview
- Draw polygon
- Edit drawn polygon

# Installing

```sh
npm i @bpartners/annotator-component
```

# Example

Import the principal component

```js
import { AnnotatorCanvas } from '@bpartners/annotator-component';
```

Use the `AnnotatorCanvas` component.

```js
function App() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);

  return (
    <div>
      <AnnotatorCanvas
        height='70vh'
        width='60vw'
        setPolygons={setPolygons}
        polygonList={polygons}
        image={image}
        allowAnnotation
        buttonsComponent={CustomButtonsComponent}
        zoom={20}
      />
    </div>
  );
}
```

# Types

**Polygon**

```ts
interface Polygon {
  id: string; // default uuid
  fillColor: string;
  strokeColor: string;
  points: Point[]; // default []
  isInvisible?: boolean; // default false
  polygonLineSizeProps?: PolygonSizeProps; // default undefined
}
```

**PolygonSizeProps**

```ts
interface PolygonSizeProps {
  converterApiUrl: string; // default ""
  imageName: string; // default ""
  showLineSize: boolean; // default false
}
```

**Point**

```ts
interface Point {
  x: number;
  y: number;
}
```

```ts
interface ScaleCallbacks {
  scaleUp: () => void;
  scaleReste: () => void;
  scaleDown: () => void;
}
```

# Props

| Name                 | Type                                      | Description                                   |
| -------------------- | ----------------------------------------- | --------------------------------------------- |
| height               | `string`                                  | The height of the canvas                      |
| width                | `string`                                  | The width of the canvas                       |
| setPolygons          | `(polygons: Polygon[])=> void`            | Function to update the polygon list state     |
| polygonList          | `Polygon`                                 | List of polygons to show                      |
| image                | `string`,`file`                           | Image to show and to annotate                 |
| polygonLineSizeProps | `PolygonLineSizeProps`                    | Props to show polygon line & area measurement |
| buttonsComponent     | `(callback: ScaleCallbacks) => ReactNode` | Add a custom buttons component                |
| zoom     | `number` | corresponds to those different zoom : <ul><li>BUILDINGS = 18</li><li>BUILDING = 19</li><li>HOUSES_0 = 20</li><li>HOUSES_1 = 21</li><li>HOUSES_2 = 22 </li><li>HOUSE_PROPERTY = 23</li></ul>