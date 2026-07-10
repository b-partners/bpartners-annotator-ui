import { useEffect, useState } from 'react';
import { AnnotatorCanvas } from '../../lib';
import { Point, Polygon } from '../../lib/types';
import image from '../../src/assets/Rennes_Solar_Panel_Batch_1_519355_363821.jpg';

// The marker arrives asynchronously (undefined first, then a value), mirroring the real consumer.
const Harness = ({ marker, storageKey }: { marker: Point; storageKey?: string }) => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [m, setM] = useState<Point | undefined>(undefined);
  useEffect(() => {
    const t = setTimeout(() => setM(marker), 300);
    return () => clearTimeout(t);
  }, [marker]);
  return (
    <AnnotatorCanvas
      height='70vh'
      width='60vw'
      setPolygons={setPolygons}
      polygonList={polygons}
      image={image}
      zoom={19}
      markerPosition={m}
      storageKey={storageKey}
    />
  );
};

const container = () => cy.get('[data-cy=annotator-canvas-container]').parent();

const centerFraction = ($c: JQuery<HTMLElement>) => {
  const el = $c[0];
  return { fx: (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth, fy: (el.scrollTop + el.clientHeight / 2) / el.scrollHeight };
};

const expectCentered = (label: string) =>
  container().then($c => {
    const { fx, fy } = centerFraction($c);
    expect(fx, `centered horizontally ${label}`).to.be.closeTo(0.5, 0.03);
    expect(fy, `centered vertically ${label}`).to.be.closeTo(0.5, 0.03);
  });

describe('reset recenters the image after an async-marker zoom', () => {
  it('centers on reset with a near-center marker', () => {
    cy.viewport(1400, 900);
    cy.mount(<Harness marker={{ x: 512, y: 512 }} />);
    cy.get('canvas').should('exist');
    cy.wait(900);
    cy.contains('button', 'reset').click();
    cy.wait(700);
    expectCentered('after reset (center marker)');
  });

  it('centers on reset with an edge marker', () => {
    cy.viewport(1400, 900);
    cy.mount(<Harness marker={{ x: 980, y: 980 }} />);
    cy.get('canvas').should('exist');
    cy.wait(900);
    cy.contains('button', 'reset').click();
    cy.wait(700);
    expectCentered('after reset (edge marker)');
  });

  it('centers on reset with an edge marker and storageKey', () => {
    cy.viewport(1400, 900);
    localStorage.clear();
    cy.mount(<Harness marker={{ x: 980, y: 40 }} storageKey='marker-reset-test' />);
    cy.get('canvas').should('exist');
    cy.wait(900);
    cy.contains('button', 'reset').click();
    cy.wait(700);
    expectCentered('after reset (edge marker + storageKey)');
  });
});
