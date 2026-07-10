import { useState } from 'react';
import { AnnotatorCanvas } from '../../lib';
import { Polygon } from '../../lib/types';
import image from '../../src/assets/Rennes_Solar_Panel_Batch_1_519355_363821.jpg';

const Harness = () => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  return <AnnotatorCanvas height='70vh' width='60vw' setPolygons={setPolygons} polygonList={polygons} image={image} zoom={19} />;
};

const container = () => cy.get('[data-cy=annotator-canvas-container]').parent();

// Viewport-center as a 0..1 fraction of the scrollable area — 0.5/0.5 means the image is centered.
const centerFraction = ($c: JQuery<HTMLElement>) => {
  const el = $c[0];
  return {
    fx: (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth,
    fy: (el.scrollTop + el.clientHeight / 2) / el.scrollHeight,
  };
};

describe('image stays centered across container resizes', () => {
  it('re-centers when the container size changes (window/layout resize)', () => {
    cy.viewport(1400, 900);
    cy.mount(<Harness />);
    cy.get('canvas').should('exist');
    cy.wait(600);

    container().then($c => {
      const { fx, fy } = centerFraction($c);
      expect(fx, 'centered horizontally on mount').to.be.closeTo(0.5, 0.03);
      expect(fy, 'centered vertically on mount').to.be.closeTo(0.5, 0.03);
    });

    cy.viewport(1000, 700);
    cy.wait(500);
    container().then($c => {
      const { fx, fy } = centerFraction($c);
      expect(fx, 'still centered after shrinking the container').to.be.closeTo(0.5, 0.03);
      expect(fy, 'still centered after shrinking the container').to.be.closeTo(0.5, 0.03);
    });

    cy.viewport(1700, 1050);
    cy.wait(500);
    container().then($c => {
      const { fx, fy } = centerFraction($c);
      expect(fx, 'still centered after growing the container').to.be.closeTo(0.5, 0.03);
      expect(fy, 'still centered after growing the container').to.be.closeTo(0.5, 0.03);
    });
  });
});
