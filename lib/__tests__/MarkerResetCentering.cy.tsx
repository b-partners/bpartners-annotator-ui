import { useEffect, useState } from 'react';
import { AnnotatorCanvas } from '../../lib';
import { Point, Polygon } from '../../lib/types';
import image from '../../src/assets/Rennes_Solar_Panel_Batch_1_519355_363821.jpg';

// The marker arrives asynchronously (undefined first, then a value), mirroring the real consumer.
const Harness = ({ marker, storageKey }: { marker?: Point; storageKey?: string }) => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [m, setM] = useState<Point | undefined>(undefined);
  useEffect(() => {
    if (!marker) return;
    const t = setTimeout(() => setM(marker), 300);
    return () => clearTimeout(t);
  }, [marker]);
  return (
    <AnnotatorCanvas height='70vh' width='60vw' setPolygons={setPolygons} polygonList={polygons} image={image} markerPosition={m} storageKey={storageKey} />
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

const zoomIn = () => cy.contains('button', 'zoom +').click();

describe('marker focus happens on the first zoom, not on load', () => {
  beforeEach(() => {
    cy.viewport(1400, 900);
    localStorage.clear();
  });

  it('does not auto-zoom on load: an edge marker stays centered until the user zooms', () => {
    cy.mount(<Harness marker={{ x: 980, y: 980 }} />);
    cy.get('canvas').should('exist');
    cy.wait(900);
    expectCentered('on load with an edge marker');
  });

  it('does not auto-zoom on load with no marker', () => {
    cy.mount(<Harness />);
    cy.get('canvas').should('exist');
    cy.wait(600);
    expectCentered('on load without a marker');
  });

  it('focuses the marker on the first zoom of an untouched view', () => {
    cy.mount(<Harness marker={{ x: 980, y: 980 }} />);
    cy.get('canvas').should('exist');
    cy.wait(900);
    zoomIn();
    cy.wait(400);
    // The bottom-right marker pulls the viewport center past the middle toward it.
    container().then($c => {
      const { fx, fy } = centerFraction($c);
      expect(fx, 'moved toward the marker horizontally').to.be.greaterThan(0.55);
      expect(fy, 'moved toward the marker vertically').to.be.greaterThan(0.55);
    });
  });

  it('keeps the view centered when zooming with a centered marker', () => {
    cy.mount(<Harness marker={{ x: 512, y: 512 }} />);
    cy.get('canvas').should('exist');
    cy.wait(900);
    zoomIn();
    cy.wait(400);
    expectCentered('after first zoom with a center marker');
  });

  it('recenters the image on reset after focusing an edge marker', () => {
    cy.mount(<Harness marker={{ x: 980, y: 980 }} />);
    cy.get('canvas').should('exist');
    cy.wait(900);
    zoomIn();
    cy.wait(400);
    cy.contains('button', 'reset').click();
    cy.wait(700);
    expectCentered('after reset');
  });

  it('re-focuses the marker on the first zoom after a reset', () => {
    cy.mount(<Harness marker={{ x: 980, y: 980 }} />);
    cy.get('canvas').should('exist');
    cy.wait(900);
    zoomIn();
    cy.wait(400);
    cy.contains('button', 'reset').click();
    cy.wait(700);
    // Zooming again from the reset (untouched) view focuses the marker just like on load.
    zoomIn();
    cy.wait(400);
    container().then($c => {
      const { fx, fy } = centerFraction($c);
      expect(fx, 'moved toward the marker horizontally after reset').to.be.greaterThan(0.55);
      expect(fy, 'moved toward the marker vertically after reset').to.be.greaterThan(0.55);
    });
  });
});
