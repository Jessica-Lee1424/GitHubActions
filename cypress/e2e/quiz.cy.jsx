describe('E2E Quiz Test', () => {
    beforeEach(() => {
      // Intercept the API call to get random questions
      cy.intercept(
        {
          method: 'GET',
          url: '/api/questions/random',
        },
        {
          fixture: 'questions.json',
          statusCode: 200,
        }
      ).as('getRandomQuestions');
  
      // Visit the homepage before each test
      cy.visit('/'); // Adjust the URL to your application's homepage
    });
  
    it('should start the quiz and display the first question', () => {
      cy.get('button').contains('Start Quiz').click();
      
      // Verify that the first question card is visible
      cy.get('.card').should('be.visible');
      cy.get('h2').should('not.be.empty'); // Question text should be present
    });
  
    it('should answer questions and complete the quiz', () => {
      cy.get('button').contains('Start Quiz').click();
  
      // Answer the first question
      cy.get('button').contains('1').click(); // Assuming '1' is a valid answer
  
      // Verify that the quiz completion card is visible
      cy.get('.alert-success').should('be.visible').and('contain', 'Your score');
    });
  
    it('should restart the quiz after completion', () => {
      cy.get('button').contains('Start Quiz').click();
  
      // Answer the first question
      cy.get('button').contains('1').click(); // Assuming '1' is a valid answer
  
      // Restart the quiz
      cy.get('button').contains('Take New Quiz').click();
  
      // Verify the quiz is restarted and a new question is displayed
      cy.get('.card').should('be.visible');
      cy.get('h2').should('not.be.empty');
    });
  
    it('should start the timer at 30 seconds for each question', () => {
      cy.get('button').contains('Start Quiz').click();
  
      // Verify that the timer starts at 30 seconds
      cy.get('.alert.alert-info').should('contain', 'Time Left: 30 seconds');
    });
  
    it('should count down the timer', () => {
      cy.get('button').contains('Start Quiz').click();
  
      // Wait for 3 seconds to simulate the countdown
      cy.wait(3000); // Adjust timing to match test environment speed
      cy.get('.alert.alert-info').should('contain', 'Time Left: 27 seconds');
    });
  
    // it('should move to the next question when the timer reaches 0', () => {
    //   cy.get('button').contains('Start Quiz').click();
  
    //   // Wait for the timer to reach 0 (30 seconds)
    //   cy.wait(30000); // Simulate the timeout
  
    //   // Verify that the next question is displayed or the quiz ends
    //   cy.get('h2').should('not.be.empty'); // Ensure it's not the first question
    //   cy.get('.alert.alert-info').should('contain', 'Time Left: 30 seconds'); // Timer resets for the next question
    // });
  });