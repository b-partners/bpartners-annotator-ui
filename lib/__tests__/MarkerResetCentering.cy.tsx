import { useEffect, useState } from 'react';
import { AnnotatorCanvas } from '../../lib';
import { Point, Polygon } from '../../lib/types';
import image from '../../src/assets/Rennes_Solar_Panel_Batch_1_519355_363821.jpg';

// The marker arrives asynchronously (undefined first, then a value), mirroring the real consumer.
const Harness = ({ marker, storageKey, initialPolygons = [] }: { marker?: Point; storageKey?: string; initialPolygons?: Polygon[] }) => {
  const [polygons, setPolygons] = useState<Polygon[]>(initialPolygons);
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
    expect(fx, `centered horizontally ${label}`).to.be.closeTo(0.5, 0.05);
    expect(fy, `centered vertically ${label}`).to.be.closeTo(0.5, 0.05);
  });

// Rendered width of the base canvas — grows with the zoom, so it tells an auto-zoomed-in load
// (large) apart from a fit-scale load (small) without depending on scroll math.
const canvasWidthOf = ($c: JQuery<HTMLElement>) => ($c[0].querySelector('canvas') as HTMLCanvasElement).width;

const zoomIn = () => cy.contains('button', 'zoom +').click();

// Where a DOM point sits inside the viewport, as a 0..1 fraction of the viewport box.
const pinFraction = ($c: JQuery<HTMLElement>, $pin: JQuery<HTMLElement>) => {
  const cr = $c[0].getBoundingClientRect();
  const pr = $pin[0].getBoundingClientRect();
  return { x: (pr.left + pr.width / 2 - cr.left) / cr.width, y: (pr.top + pr.height / 2 - cr.top) / cr.height };
};

// Where the image (canvas) center sits inside the viewport, as a fraction of the viewport width —
// the truthful measure of centering, independent of how far an overlay inflates the scroll area.
const imageCenterX = ($c: JQuery<HTMLElement>) => {
  const el = $c[0];
  const canvas = el.querySelector('canvas') as HTMLElement;
  const cr = el.getBoundingClientRect();
  const gr = canvas.getBoundingClientRect();
  return (gr.left + gr.width / 2 - cr.left) / cr.width;
};

describe('fresh load focuses the polygon/marker, then the user takes over', () => {
  beforeEach(() => {
    cy.viewport(1400, 900);
    localStorage.clear();
  });

  it('opens zoomed in and centered on a center marker (fresh storage)', () => {
    cy.mount(<Harness marker={{ x: 512, y: 512 }} />);
    cy.get('canvas').should('exist');
    cy.wait(1200);
    // Zoomed in: the canvas is far wider than the fit-scale width.
    container().then($c => expect(canvasWidthOf($c), 'auto-zoomed in on load').to.be.greaterThan(1400));
    // The marker pin lands at the viewport center.
    container().then($c =>
      cy.get('[data-cy=annotator-marker]').then($m => {
        const { x, y } = pinFraction($c, $m);
        expect(x, 'center marker pin centered horizontally').to.be.closeTo(0.5, 0.12);
        expect(y, 'center marker pin centered vertically').to.be.closeTo(0.5, 0.12);
      })
    );
  });

  it('opens zoomed in and centered on an edge marker (fresh storage)', () => {
    cy.mount(<Harness marker={{ x: 980, y: 980 }} />);
    cy.get('canvas').should('exist');
    cy.wait(1200);
    container().then($c => expect(canvasWidthOf($c), 'auto-zoomed in on load').to.be.greaterThan(1400));
    container().then($c =>
      cy.get('[data-cy=annotator-marker]').then($m => {
        const { x, y } = pinFraction($c, $m);
        expect(x, 'edge marker pin pulled to center horizontally').to.be.closeTo(0.5, 0.15);
        expect(y, 'edge marker pin pulled to center vertically').to.be.closeTo(0.5, 0.15);
      })
    );
  });

  it('a polygon takes precedence over the marker as the focus target', () => {
    const polygon: Polygon = {
      id: 'p1',
      fillColor: '#0E4EB340',
      strokeColor: '#0E4EB3',
      points: [
        { x: 180, y: 180 },
        { x: 220, y: 180 },
        { x: 200, y: 220 },
      ],
    };
    // Marker sits bottom-right, polygon top-left: the view must go to the polygon, not the marker.
    cy.mount(<Harness marker={{ x: 980, y: 980 }} initialPolygons={[polygon]} />);
    cy.get('canvas').should('exist');
    cy.wait(1200);
    container().then($c => {
      expect(canvasWidthOf($c), 'auto-zoomed in on load').to.be.greaterThan(1400);
      const { fx, fy } = centerFraction($c);
      // The polygon bbox center (~200,200) sits in the top-left third of the image.
      expect(fx, 'view moved toward the polygon, not the bottom-right marker').to.be.lessThan(0.45);
      expect(fy, 'view moved toward the polygon, not the bottom-right marker').to.be.lessThan(0.45);
    });
  });

  it('does not auto-zoom with no marker and no polygon: fits and centers by size', () => {
    cy.mount(<Harness />);
    cy.get('canvas').should('exist');
    cy.wait(700);
    container().then($c => expect(canvasWidthOf($c), 'stays at fit scale, not zoomed in').to.be.lessThan(1500));
    expectCentered('on load without a marker or polygon');
  });

  it('recenters the image on reset after a focus zoom', () => {
    cy.mount(<Harness marker={{ x: 980, y: 980 }} />);
    cy.get('canvas').should('exist');
    cy.wait(1200);
    cy.contains('button', 'reset').click();
    cy.wait(700);
    container().then($c => expect(canvasWidthOf($c), 'back to fit scale after reset').to.be.lessThan(1500));
    expectCentered('after reset');
  });

  it('treats reset as a first move: the next zoom keeps the center, not the marker', () => {
    cy.mount(<Harness marker={{ x: 980, y: 980 }} />);
    cy.get('canvas').should('exist');
    cy.wait(1200);
    cy.contains('button', 'reset').click();
    cy.wait(700);
    // Reset counts as the user's first move, so zooming again keeps the centered view instead of
    // pulling back toward the marker.
    zoomIn();
    cy.wait(400);
    expectCentered('after zooming in from a reset');
  });

  it('persists the reset view (zoom 0, centered, first move) to localStorage', () => {
    cy.mount(<Harness marker={{ x: 980, y: 980 }} storageKey='reset-view' />);
    cy.get('canvas').should('exist');
    cy.wait(1200);
    cy.contains('button', 'reset').click();
    cy.wait(700);
    cy.then(() => {
      const saved = JSON.parse(window.localStorage.getItem('reset-view') || '{}');
      expect(saved.scale, 'zoom reset to 0').to.eq(0);
      expect(saved.firstMove, 'reset counts as first move').to.eq(true);
      expect(saved.scrollPosition, 'centered position stored').to.deep.eq({ x: 0.5, y: 0.5 });
    });
  });

  it('keeps the current center on zoom once the user has panned (first move done)', () => {
    // No marker/polygon: the view opens at fit, centered. The user pans, then zooms.
    cy.mount(<Harness />);
    cy.get('canvas').should('exist');
    cy.wait(700);
    container().then($pre => container().scrollTo(Math.round($pre[0].scrollWidth * 0.2), Math.round($pre[0].scrollHeight * 0.7), { ensureScrollable: false }));
    cy.wait(300);
    let before: { fx: number; fy: number };
    container().then($c => (before = centerFraction($c)));
    zoomIn();
    cy.wait(400);
    container().then($c => {
      const { fx, fy } = centerFraction($c);
      expect(fx, 'view center kept horizontally after first move').to.be.closeTo(before.fx, 0.06);
      expect(fy, 'view center kept vertically after first move').to.be.closeTo(before.fy, 0.06);
    });
  });

  it('keeps the focused view put when toggling from move to edit mode', () => {
    cy.mount(<Harness marker={{ x: 980, y: 980 }} />);
    cy.get('canvas').should('exist');
    cy.wait(1200);
    // Capture where the focus zoom left the view.
    let before: { fx: number; fy: number };
    container().then($c => (before = centerFraction($c)));
    // Enter move mode, then back to edit mode. Neither toggle may move the image.
    cy.contains('button', 'move').click();
    cy.wait(200);
    cy.contains('button', 'annotate').click();
    cy.wait(400);
    container().then($c => {
      const { fx, fy } = centerFraction($c);
      expect(fx, 'view unchanged horizontally after mode toggle').to.be.closeTo(before.fx, 0.03);
      expect(fy, 'view unchanged vertically after mode toggle').to.be.closeTo(before.fy, 0.03);
    });
  });

  it('keeps the image centered on zoom even when an overlay inflates the scroll area', () => {
    cy.mount(<Harness />);
    cy.get('canvas').should('exist');
    cy.wait(700);
    // Marker/measurement overlays are absolutely positioned and can push the container's scroll
    // area far past the image. The view fraction must be measured against the canvas, not that
    // inflated scroll area, or the next zoom under-scrolls and slides the image toward the corner.
    container().then($c => {
      const spacer = document.createElement('div');
      spacer.style.cssText = 'position:absolute;left:6000px;top:0;width:1px;height:1px;';
      $c[0].appendChild(spacer);
      $c[0].dispatchEvent(new Event('scroll'));
    });
    cy.wait(100);
    zoomIn();
    cy.wait(400);
    container().then($c => expect(imageCenterX($c), 'image stays centered despite inflated scrollWidth').to.be.closeTo(0.5, 0.1));
  });
});
