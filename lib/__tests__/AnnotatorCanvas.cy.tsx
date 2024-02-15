import { AnnotatorCanvas } from '..';
import image from '../../src/assets/image.png';

describe('Test annotator canvas component', () => {
  it('Test show and zoom image', () => {
    cy.mount(<AnnotatorCanvas polygoneList={[]} addPolygone={() => {}} height='70vh' width='60vw' image={image} />);

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
});
