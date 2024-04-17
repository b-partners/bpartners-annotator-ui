import App from '../../src/App';

const CANVAS_FOR_CURSOR = 'annotator-canvas-cursor';
const MOUSE_X_POSITION = 'annotator-x-positions';
const MOUSE_Y_POSITION = 'annotator-y-positions';

describe('Test annotator canvas component', () => {
  it('Test show and zoom image', () => {
    cy.mount(<App />);

    cy.get('canvas').should('exist');
    cy.get('button').should('have.length', 3);

    cy.contains('zoom CUSTOM +').click().click().click();
    cy.contains('zoom CUSTOM -').click().click().click().click();
    cy.contains('reset CUSTOM').click();
  });

  it('Test draw polygon', () => {
    cy.viewport(1920, 1080);
    cy.mount(<App />);
    cy.dataCy('annotator-cursor-positions').contains('x : 0');
    cy.dataCy('annotator-cursor-positions').contains('y : 0');

    cy.dataCy(CANVAS_FOR_CURSOR).click(3710, 0, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('1024');
    cy.dataCy(MOUSE_Y_POSITION).contains('0');

    cy.dataCy(CANVAS_FOR_CURSOR).click(200, 200, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('0');
    cy.dataCy(MOUSE_Y_POSITION).contains('130');

    cy.dataCy(CANVAS_FOR_CURSOR).click(500, 150, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('232');
    cy.dataCy(MOUSE_Y_POSITION).contains('80');

    cy.dataCy(CANVAS_FOR_CURSOR).click(300, 250, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('32');
    cy.dataCy(MOUSE_Y_POSITION).contains('18');

    cy.dataCy(CANVAS_FOR_CURSOR).click(200, 200, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('0');
    cy.dataCy(MOUSE_Y_POSITION).contains('130');

    cy.dataCy(CANVAS_FOR_CURSOR).click(500, 150, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('232');
    cy.dataCy(MOUSE_Y_POSITION).contains('80');
  });
});
