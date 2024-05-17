describe('Movies', () => {
    before(() => {
        cy.setupPact('BiWebConsumer', 'BiPostmanMoviesAPI');
        cy.intercept('http://localhost:3001/movie/1', {
            statusCode: 200,
            body: { id: 1, name: "finding nemo", year: 2003 }
        }).as('movies');
    });

    it('Movies list', () => {
        cy.visit('/');
        cy.usePactWait('movies').its('response.statusCode').should('eq', 200);
        cy.contains('finding nemo').should('be.visible');
    });
});
