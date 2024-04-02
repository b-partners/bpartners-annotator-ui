import { AnnotatorCanvas } from '..';
import image from '../../src/assets/image.png';
import { Annotator } from './components';

const CANVAS_FOR_CURSOR = 'annotator-canvas-cursor';
const MOUSE_X_POSITION = 'annotator-x-positions';
const MOUSE_Y_POSITION = 'annotator-y-positions';

describe('Test annotator canvas component', () => {
  it('Test show and zoom image', () => {
    cy.mount(<AnnotatorCanvas polygonList={[]} setPolygons={() => {}} height='70vh' width='60vw' image={image} />);

    cy.get('canvas').should('exist');
    cy.get('button').should('have.length', 3);

    cy.url().should('include', 'scale=1.76');

    cy.contains('zoom +').click().click().click();
    cy.url().should('include', 'scale=2.16');
    cy.contains('zoom -').click().click().click().click();
    cy.url().should('include', 'scale=1.36');
    cy.contains('reset').click();
    cy.url().should('include', 'scale=1.76');
  });

  it('Test draw polygon', () => {
    cy.mount(<Annotator />);
    cy.dataCy('annotator-cursor-positions').contains('x : 0');
    cy.dataCy('annotator-cursor-positions').contains('y : 0');

    cy.dataCy(CANVAS_FOR_CURSOR).click(3710, 0, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('1003');
    cy.dataCy(MOUSE_Y_POSITION).contains('0');

    cy.dataCy(CANVAS_FOR_CURSOR).click(200, 200, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('126');
    cy.dataCy(MOUSE_Y_POSITION).contains('156');

    cy.dataCy(CANVAS_FOR_CURSOR).click(500, 150, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('426');
    cy.dataCy(MOUSE_Y_POSITION).contains('106');

    cy.dataCy(CANVAS_FOR_CURSOR).click(300, 250, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('226');
    cy.dataCy(MOUSE_Y_POSITION).contains('206');

    cy.dataCy(CANVAS_FOR_CURSOR).click(200, 200, { force: true });
    cy.dataCy(MOUSE_X_POSITION).contains('126');
    cy.dataCy(MOUSE_Y_POSITION).contains('156');
  });
});
