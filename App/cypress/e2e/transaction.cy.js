describe('Transaction Flow', () => {
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
    cy.get('input[placeholder="Username"]').type('john.doe@gmail.com');
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

  it('completes a transaction successfully', () => {
    // Mock the fetch loyalty programs API response
    cy.intercept({
      method: 'GET',
      url: 'http://localhost:3000/info/get-loyalty-programs',
      headers: { Authorization: 'Bearer tcMockToken' },
    }, {
      statusCode: 200,
      body: [
        {
          pid: '1',
          name: 'Program A',
          conversion: 2,
          currency: 'USD',
          enrol_link: 'http://example.com/enrol',
          terms_c_link: 'http://example.com/terms',
          member_format: '^[0-9]{6}$',
          process_time: '2 days',
          description: 'Description A',
        },
      ],
    }).as('fetchLoyaltyPrograms');

    // Mock the fetch user points API response
    cy.intercept({
      method: 'GET',
      url: 'http://localhost:5001/api/points/123',
    }, {
      statusCode: 200,
      body: { points: 1000 },
    }).as('fetchUserPoints');

    // Ensure intercepts are ready before visiting the page
    cy.visit('http://localhost:5173/loyaltypoints');

    // Click on bridge
    cy.get('.TC-link').contains('Bridge').click();

    // Wait for intercepts
    cy.wait('@fetchLoyaltyPrograms');
    cy.wait('@fetchUserPoints');

    // Select a loyalty program
    cy.get('.select-merchant-menu').click();
    cy.get('.select__option').contains('Program A').click();

    // Enter membership ID
    cy.get('input[placeholder="Insert your Membership ID here"]').type('123456');
    cy.get('input[placeholder="Insert your Membership ID here"]').type('{enter}');

    // Click 'More Information' button
    cy.get('.modal_button').click();

    // Close the modal
    cy.get('.close-button').click();

    // Enter the amount to transfer
    cy.get('input[placeholder="0"]').type('500');

    // Mock the transaction API response
    cy.intercept('POST', 'http://localhost:3000/transact/add_record', {
      statusCode: 200,
      body: { success: true },
    }).as('sendTransaction');

    // Click 'Confirm Transaction' button
    cy.get('.confirm-transaction-button').click();

    // Wait for the transaction request to complete
    cy.wait('@sendTransaction');

    // Verify transaction success message
    cy.get('.transaction-message').should('contain', 'Transaction Successful!');
    cy.wait(7000);
    // Mock the obtain_record API response
    cy.intercept({
      method: 'GET',
      url: 'http://localhost:3000/transact/obtain_record/byUserId?user_id=123',
      headers: { Authorization: 'Bearer tcMockToken' },
    }, (req) => {
      console.log('Intercepted request:', req);
      req.reply({
        statusCode: 200,
        body: [
          { transaction_date: '22/07/2024', t_id: '4903481991', loyalty_pid: 'Fast Fruits', amount: '-900.00', status: 'Pending' },
          { transaction_date: '14/07/2024', t_id: '3594090220', loyalty_pid: 'Royal Air', amount: '-0.10', status: 'Pending' },
        ],
      });
    }).as('fetchTransactionHistory');

    // Navigate to the transaction history page
    cy.get('.TC-link').contains('Transaction').click();

 

    // Wait for the fetchTransactionHistory request to complete
    cy.wait('@fetchTransactionHistory');

    // Verify the transaction history entries
    
    cy.wait(1000);

    // Verify the transaction history entries
    cy.get('.transaction-table').first().should('contain', 'Fast Fruits').and('contain', '-900.00').and('contain', 'Pending');
    cy.get('.transaction-table').last().should('contain', 'Royal Air').and('contain', '-0.10').and('contain', 'Pending');
  });
});;
