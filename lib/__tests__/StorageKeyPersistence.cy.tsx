import { useState } from 'react';
import { AnnotatorCanvas } from '../../lib';
import { Polygon } from '../../lib/types';
import imageA from '../../src/assets/Rennes_Solar_Panel_Batch_1_519355_363821.jpg';

// No `scale`/`scrollPosition`/`onScrollChange` wiring — the component persists the view itself
// under `storageKey`. Remounting reads it straight back from localStorage.
const Harness = ({ mountId }: { mountId: number }) => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  return (
    <AnnotatorCanvas
      key={mountId}
      height='70vh'
      width='60vw'
      setPolygons={setPolygons}
      polygonList={polygons}
      image={imageA}
      zoom={19}
      storageKey='test-view'
    />
  );
};

const Remountable = () => {
  const [mountId, setMountId] = useState(0);
  return (
    <div>
      <button data-cy='remount' onClick={() => setMountId(id => id + 1)}>
        remount
      </button>
      <Harness mountId={mountId} />
    </div>
  );
};

const container = () => cy.get('[data-cy=annotator-canvas-container]').parent();
const top = ($el: JQuery<HTMLElement>) => $el[0].scrollTop;
const settle = 600;

describe('storageKey-driven view persistence', () => {
  beforeEach(() => cy.then(() => window.localStorage.clear()));

  it('restores the scroll position from localStorage across a remount', () => {
    cy.viewport(1400, 900);
    cy.mount(<Remountable />);
    cy.get('canvas').should('exist');
    cy.wait(settle);

    container().should($c => expect($c[0].scrollHeight, 'scroll room exists').to.be.greaterThan($c[0].clientHeight + 100));

    container().then($pre => container().scrollTo(0, Math.round($pre[0].scrollHeight * 0.5), { ensureScrollable: false }));
    cy.wait(settle);

    container().then($scrolled => {
      const scrolledTop = top($scrolled);
      expect(scrolledTop, 'user scrolled down').to.be.greaterThan(200);

      // localStorage holds the new position, with no consumer state involved.
      cy.then(() => {
        const saved = JSON.parse(window.localStorage.getItem('test-view') || '{}');
        expect(saved.scrollPosition, 'scrollPosition persisted').to.have.property('y');
      });

      cy.get('[data-cy=remount]').click();
      cy.wait(settle);
      container().then($after => expect(top($after), 'restored after remount').to.be.closeTo(scrolledTop, 150));
    });
  });
});
