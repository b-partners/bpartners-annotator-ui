import { useState } from 'react';
import { AnnotatorCanvas } from '../../lib';
import { Point, Polygon } from '../../lib/types';
import image from '../../src/assets/Rennes_Solar_Panel_Batch_1_519355_363821.jpg';

const Harness = () => {
  const [tab, setTab] = useState<'a' | 'b'>('a');
  // Tab A is zoomed (real scroll room); tab B sits at base zoom where the image fits the
  // container, so switching to it recenters with no scroll room — the case that fired no
  // scroll event and left the old echo-guard stale.
  const [scaleA, setScaleA] = useState(2);
  const [scaleB, setScaleB] = useState(0);
  const [posA, setPosA] = useState<Point | undefined>({ x: 0.5, y: 0.85 });
  const [posB, setPosB] = useState<Point | undefined>(undefined);
  const [polygons, setPolygons] = useState<Polygon[]>([]);

  const isA = tab === 'a';

  return (
    <div>
      <button data-cy='to-a' onClick={() => setTab('a')}>
        a
      </button>
      <button data-cy='to-b' onClick={() => setTab('b')}>
        b
      </button>
      <AnnotatorCanvas
        height='70vh'
        width='60vw'
        setPolygons={setPolygons}
        polygonList={polygons}
        image={image}
        zoom={19}
        scale={isA ? scaleA : scaleB}
        onScaleChange={s => (isA ? setScaleA(s) : setScaleB(s))}
        scrollPosition={isA ? posA : posB}
        onScrollChange={p => (isA ? setPosA(p) : setPosB(p))}
      />
    </div>
  );
};

const container = () => cy.get('[data-cy=annotator-canvas-container]').parent();
const settle = 300;

describe('per-tab scroll position on a single mounted instance', () => {
  it('restores a zoomed tab after visiting a fit-to-container tab (no scroll event)', () => {
    cy.viewport(1400, 900);
    cy.mount(<Harness />);
    cy.get('canvas').should('exist');
    cy.wait(500);

    container().should($c => expect($c[0].scrollHeight, 'tab A has scroll room').to.be.greaterThan($c[0].clientHeight + 100));

    container().then($a => {
      const aTop = $a[0].scrollTop;
      expect(aTop, 'tab A restored to its saved near-bottom position').to.be.greaterThan($a[0].scrollHeight * 0.4);

      cy.get('[data-cy=to-b]').click();
      cy.wait(settle);

      cy.get('[data-cy=to-a]').click();
      cy.wait(settle);
      container().then($a2 => {
        expect($a2[0].scrollTop, 'tab A scroll restored after fit-to-container tab').to.be.closeTo(aTop, 40);
      });
    });
  });
});
