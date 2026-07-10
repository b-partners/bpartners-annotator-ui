import App from '../../src/App';

const CANVAS_FOR_CURSOR = 'annotator-canvas-cursor';
const MOUSE_X_POSITION = 'annotator-x-positions';
const MOUSE_Y_POSITION = 'annotator-y-positions';

describe('Test annotator canvas component', () => {
  it('Test show and zoom image', () => {
    cy.mount(<App />);

    cy.get('canvas').should('exist');
    cy.get('button').should('have.length', 4);

    cy.contains('zoom CUSTOM +').click().click().click();
    cy.contains('zoom CUSTOM -').click().click().click().click();
    cy.contains('reset CUSTOM').click();
  });

  it('Test draw polygon', () => {
    cy.viewport(1920, 1080);
    // App passes a `markerPosition`, so it opens auto-zoomed 3x on the marker. This test asserts
    // the physical→logical coordinate mapping at fit scale, so start from a clean, reset view:
    // clear the persisted zoom/scroll and reset back to fit after the marker zoom has settled.
    cy.clearLocalStorage();
    cy.mount(<App />);
    cy.get('canvas').should('exist');
    cy.wait(700);
    cy.contains('reset CUSTOM').click();
    cy.wait(300);
    cy.dataCy('annotator-cursor-positions').contains('x : 0');
    cy.dataCy('annotator-cursor-positions').contains('y : 0');

    cy.dataCy(CANVAS_FOR_CURSOR).click(0, 0, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('0');
    cy.dataCy(MOUSE_Y_POSITION).contains('0');

    cy.dataCy(CANVAS_FOR_CURSOR).click(1000, 1000, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('717');
    cy.dataCy(MOUSE_Y_POSITION).contains('717');

    const polygon1 = [
      [500, 150],
      [350, 350],
      [200, 150],
      [500, 150],
    ];

    polygon1.forEach(([x, y]) => {
      cy.dataCy(CANVAS_FOR_CURSOR).click(x, y, { force: true });
    });
  });
});
