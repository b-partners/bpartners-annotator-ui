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
}
```

**Point**

```ts
interface Point {
  x: number;
  y: number;
}
```

# Props

| Name        | Type                           | Default | Description                               |
| ----------- | ------------------------------ | ------- | ----------------------------------------- |
| height      | `string`                       |         | The height of the canvas                  |
| width       | `string`                       |         | The width of the canvas                   |
| setPolygons | `(polygons: Polygon[])=> void` |         | Function to update the polygon list state |
| polygonList | `Polygon`                      | []      | List of polygons to show                  |
| image       | `string`,`file`                |         | Image to show and to annotate             |
