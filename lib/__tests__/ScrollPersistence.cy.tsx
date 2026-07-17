import { useState } from 'react';
import { AnnotatorCanvas } from '../../lib';
import { Point, Polygon } from '../../lib/types';
import imageA from '../../src/assets/Rennes_Solar_Panel_Batch_1_519355_363821.jpg';
import imageB from '../../src/assets/image-2.png';

interface HarnessProps {
  initialPosA?: Point;
  initialPosB?: Point;
}

const Harness = ({ initialPosA, initialPosB }: HarnessProps) => {
  const [tab, setTab] = useState<'a' | 'b'>('a');
  const [scaleA, setScaleA] = useState(2);
  const [scaleB, setScaleB] = useState(2);
  const [posA, setPosA] = useState<Point | undefined>(initialPosA);
  const [posB, setPosB] = useState<Point | undefined>(initialPosB);
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
        image={isA ? imageA : imageB}
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
const settle = 350;
const top = ($el: JQuery<HTMLElement>) => $el[0].scrollTop;

describe('per-tab scroll position on a single mounted instance', () => {
  it('keeps each tab independent scroll across switches, with different-sized images', () => {
    cy.viewport(1400, 900);
    cy.mount(<Harness initialPosA={{ x: 0.25, y: 0.25 }} initialPosB={{ x: 0.78, y: 0.78 }} />);
    cy.get('canvas').should('exist');
    cy.wait(600);

    container().should($c => expect($c[0].scrollHeight, 'scroll room exists').to.be.greaterThan($c[0].clientHeight + 100));

    container().then($a => {
      const aTop = top($a);

      cy.get('[data-cy=to-b]').click();
      cy.wait(settle);
      container().then($b => {
        const bTop = top($b);
        expect(bTop, 'B sits well below A').to.be.greaterThan(aTop + 150);

        cy.get('[data-cy=to-a]').click();
        cy.wait(settle);
        container().then($a2 => expect(top($a2), 'A restored after visiting B').to.be.closeTo(aTop, 40));

        cy.get('[data-cy=to-b]').click();
        cy.wait(settle);
        container().then($b2 => expect(top($b2), 'B restored after visiting A').to.be.closeTo(bTop, 40));
      });
    });
  });

  it('persists a real user scroll (onScrollChange not over-suppressed)', () => {
    cy.viewport(1400, 900);
    cy.mount(<Harness initialPosA={{ x: 0.5, y: 0.2 }} initialPosB={{ x: 0.5, y: 0.5 }} />);
    cy.get('canvas').should('exist');
    cy.wait(600);

    container().then($pre => container().scrollTo(0, Math.round($pre[0].scrollHeight * 0.45), { ensureScrollable: false }));
    cy.wait(settle);
    container().then($a => {
      const scrolled = top($a);
      const seedTop = 0.2 * $a[0].scrollHeight - $a[0].clientHeight / 2;
      expect(scrolled, 'user scrolled below the 0.2 seed').to.be.greaterThan(seedTop + 300);

      cy.get('[data-cy=to-b]').click();
      cy.wait(600);
      cy.get('[data-cy=to-a]').click();
      cy.wait(600);
      container().then($a2 => {
        expect(top($a2), 'user scroll persisted, not reverted to the seed').to.be.greaterThan(seedTop + 300);
        expect(top($a2), 'user scroll roughly restored').to.be.closeTo(scrolled, 150);
      });
    });
  });
});
