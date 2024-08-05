import faker from 'faker';


describe('fuzzing test', () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit('http://localhost:5173/login');

    // Mock the login API response
    cy.intercept('POST', 'http://localhost:5001/api/login', {
      statusCode: 200,
      body: {
        user: { firstName: 'John', lastName: 'Doe', points: 1000, id: '123' },
        token: 'mockToken',
      },
    }).as('loginRequest');

    // Mock the Transfer Connect login API response
    cy.intercept('POST', 'http://localhost:3000/auth/login', {
      statusCode: 200,
      body: { token: 'tcMockToken' },
    }).as('tcLoginRequest');

    // Perform login
    cy.get('input[placeholder="Email"]').type('john.doe@gmail.com');
    cy.get('input[placeholder="Password"]').type('password123!@#');
    cy.get('button.login-button').click();

    // Wait for login requests to complete
    cy.wait('@loginRequest').then((interception) => {
      // Set token in localStorage to simulate login
      localStorage.setItem('token', interception.response.body.token);
      sessionStorage.setItem('firstName', interception.response.body.user.firstName);
      sessionStorage.setItem('lastName', interception.response.body.user.lastName);
      sessionStorage.setItem('points', interception.response.body.user.points);
      sessionStorage.setItem('id', interception.response.body.user.id);
    });
    cy.wait('@tcLoginRequest').then((interception) => {
      // Set Transfer Connect token in sessionStorage
      sessionStorage.setItem('tctoken', interception.response.body.token);
    });

    // Ensure we're redirected to the home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });


  const runFuzzingTest = () => {
    // Generate random data using Faker
    const randomMembershipId = faker.datatype.number({ min: 100000, max: 999999 }).toString();
    const randomAmount = faker.datatype.number({ min: 1, max: 1000 });
    const randomMax = randomAmount + 10;
    const randomSubAmount = faker.datatype.number({ min: 0, max: randomMax }).toString();
    const sampleMembershipId = "BM1234";
    const failMembershipId = "zzz";
    
    cy.intercept('GET', 'http://localhost:3000/info/get-loyalty-programs',  {
      statusCode: 200,
      body: [{"pid": "BEST_MOVERS",
        "userid": 0,
        "name": "Best Movers",
        "currency": "MOVE",
        "process_time": "Instant",
        "description": "Moving, shipping, and heavy transports all in one app!",
        "enrol_link": "https://example.com/enrol/BEST_MOVERS",
        "terms_c_link": "undefined",
        "conversion": "5",
        "member_format": "^[A-Z]{2}[0-9]{4}$"
}],
    }).as('fetchLoyaltyPrograms');

    cy.intercept('GET', 'http://localhost:5001/api/points/123', {
      statusCode: 200,
      body: {"points": randomSubAmount},
    }).as('fetchUserPoints');

    cy.intercept('POST', 'http://localhost:3000/transact/add_record', {
      statusCode: 200,
      body: {"points": randomSubAmount},
    }).as('fetchUserPoints');
    

    // Visit the page directly where the Bridge component is located
    cy.visit('http://localhost:5173/loyaltypoints');

    // Click on bridge
    cy.get('.TC-link').contains('Bridge').click();

    // Wait for intercepts
    cy.wait('@fetchLoyaltyPrograms');
    cy.wait('@fetchUserPoints');

    // Select a loyalty program
    cy.get('.select-merchant-menu').click();
    cy.get('.select__option').contains('Best Movers').click();

    // Enter membership ID
    cy.get('input[placeholder="Insert your Membership ID here"]').type(randomMembershipId);
    cy.get('input[placeholder="Insert your Membership ID here"]').type('{enter}');

    cy.get('p.error').should('contain', 'Invalid membership ID.')
/*
    // Click 'More Information' button
    cy.get('.modal_button').click();

    // Close the modal
    cy.get('.close-button').click();

    // Enter the amount to transfer
    cy.get('input[placeholder="0"]').type(randomSubAmount);

    // Click 'Confirm Transaction' button
    cy.get('.confirm-transaction-button').click();

    // Wait for the transaction request to complete
    cy.wait('@sendTransaction');

    // Verify transaction success message
    cy.get('.transaction-message').should('contain', 'Transaction Successful!');

    // Navigate to the transaction history page
    cy.get('.TC-link').contains('Transaction').click();

    // Wait for the fetchTransactionHistory request to complete
    cy.wait('@fetchTransactionHistory');

    // Verify the transaction history entries
    cy.get('.transaction-table').first().should('contain', 'Fast Fruits').and('contain', '-900.00').and('contain', 'Pending');
    cy.get('.transaction-table').last().should('contain', 'Royal Air').and('contain', '-0.10').and('contain', 'Pending');
*/
  };


  // Run the fuzzing test for a certain number of iterations
  for (let i = 0; i < 100; i++) {
    it(`Fuzzing test iteration ${i + 1}`, () => {
      runFuzzingTest();
    });
  }
});
