describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login'); // Ensure you start each test from the login page
  });

  it('renders the login page correctly', () => {
    cy.get('input[placeholder="Email"]').should('exist');
    cy.get('input[placeholder="Password"]').should('exist');
    cy.get('button.login-button').should('exist');
  });

  it('shows error on invalid login', () => {
    cy.get('input[placeholder="Email"]').type('wronguser@gmail.com');
    cy.get('input[placeholder="Password"]').type('wrongpass');
    cy.intercept('POST', 'http://localhost:5001/api/login', {
      statusCode: 401,
      body: { message: 'Login failed' },
    }).as('loginRequest');
    cy.get('button.login-button').click();

    cy.wait('@loginRequest');
    cy.get('p').should('contain', 'Login failed');
  });

  it('logs in successfully and redirects to home', () => {
    cy.intercept('POST', 'http://localhost:5001/api/login', {
      statusCode: 200,
      body: {
        user: { firstName: 'John', lastName: 'Doe', points: 100, id: '123' },
        token: 'mockToken',
      },
    }).as('loginRequest');

    cy.intercept('POST', 'http://localhost:3000/auth/login', {
      statusCode: 200,
      body: { token: 'tcMockToken' },
    }).as('tcLoginRequest');

    cy.get('input[placeholder="Email"]').type('john.doe@gmail.com');
    cy.get('input[placeholder="Password"]').type('password123!@#');
    cy.get('button.login-button').click();

    cy.wait('@loginRequest').then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
    });

    cy.wait('@tcLoginRequest').then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
    });

    cy.url().should('eq', Cypress.config().baseUrl + '/'); // Assuming home is the root URL
    cy.get('h1').should('contain', 'Welcome'); // Check for some element on the home page
  });

  it('handles logout correctly', () => {
    // Simulate login first
    cy.intercept('POST', 'http://localhost:5001/api/login', {
      statusCode: 200,
      body: {
        user: { firstName: 'John', lastName: 'Doe', points: 100, id: '123' },
        token: 'mockToken',
      },
    }).as('loginRequest');

    cy.intercept('POST', 'http://localhost:3000/auth/login', {
      statusCode: 200,
      body: { token: 'tcMockToken' },
    }).as('tcLoginRequest');

    cy.get('input[placeholder="Email"]').type('john.doe@gmail.com');
    cy.get('input[placeholder="Password"]').type('password123!@#');
    cy.get('button.login-button').click();

    cy.wait('@loginRequest').then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
    });
    cy.wait('@tcLoginRequest').then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
    });

    // Simulate logout
    cy.get('button.Logout').click(); // Assuming the logout button has this class

    cy.url().should('eq', Cypress.config().baseUrl + '/login'); // Check if redirected to login
    cy.get('input[placeholder="Email"]').should('exist');
  });
});
