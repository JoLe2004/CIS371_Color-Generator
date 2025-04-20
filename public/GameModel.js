export default class GameModel {
    constructor(answer) {
        this.answer = answer.toUpperCase();
        this.maxAttempts = 6;
        this.guesses = [];
    }

    submitGuess(guess) {
        guess = guess.toUpperCase();
        const feedback = [];
      
        for (let i = 0; i < 6; i++) {
          const gChar = guess[i];
          const aChar = this.answer[i];
      
          if (gChar === aChar) {
            feedback[i] = "correct";
          } else if (parseInt(gChar, 16) < parseInt(aChar, 16)) {
            feedback[i] = "up";
          } else {
            feedback[i] = "down";
          }
        }
      
        this.guesses.push({ guess, feedback });
        return feedback;
    }

    isGameOver() {
        return this.guesses.length >= this.maxAttempts || this.guesses.some(g => g.guess === this.answer);
    }

    isCorrectGuess() {
        return this.guesses.some(g => g.guess === this.answer);
    }
}