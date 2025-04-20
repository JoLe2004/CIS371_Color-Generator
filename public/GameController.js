export default class WordleController {
    constructor(model) {
        this.model = model;
        this.grid = document.getElementById("grid");
        this.result = document.getElementById("result");
        this.rows = []
        this.currentRow = 0;
        this.currentCol = 0;
        this.currentGuess = "";
    
        this.addRow();
        window.addEventListener("keydown", (e) => this.handleKey(e));
      }
    
    addRow() {
        const row = document.createElement("div");
        row.className = "row";
      
        const cells = [];
      
        const hashCell = document.createElement("div");
        hashCell.className = "hash";
        hashCell.textContent = "#";
        row.appendChild(hashCell);
      
        for (let j = 0; j < 6; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            row.appendChild(cell);
            cells.push(cell);
        }
      
        this.grid.appendChild(row);
        this.rows.push(cells);
    }
    
      handleKey(e) {
        if (this.model.isGameOver()) return;
    
        const key = e.key.toUpperCase();
    
        if (key === "BACKSPACE") {
          if (this.currentCol > 0) {
            this.currentCol--;
            this.currentGuess = this.currentGuess.slice(0, -1);
            this.rows[this.currentRow][this.currentCol].textContent = "";
          }
        } else if (key === "ENTER") {
          if (this.currentGuess.length === 6) {
            this.submitGuess();
          }
        } else if (/^[0-9A-F]$/.test(key)) {
          if (this.currentCol < 6) {
            this.rows[this.currentRow][this.currentCol].textContent = key;
            this.currentGuess += key;
            this.currentCol++;
          }
        }
      }
    
    submitGuess() {
        const feedback = this.model.submitGuess(this.currentGuess);
        const hints = document.createElement("div");
        hints.classList.add("hints")

        feedback.forEach((type, i) => {
          const cell = document.createElement("i");

        if (type === "correct") {
            cell.classList.add("bx", "bxs-check-circle", "green");
        } else if (type === "up") {
            cell.classList.add("bx", "bxs-up-arrow-alt", "red");
        } else if (type === "down") {
            cell.classList.add("bx", "bxs-down-arrow-alt", "red");
        }        
          hints.appendChild(cell);
        });
        
        this.grid.appendChild(hints);
        if (this.model.isCorrectGuess()) {
          this.result.textContent = `You guessed it! #${this.model.answer}`;
        } else if (this.model.isGameOver()) {
          this.result.textContent = `Out of attempts. The answer was #${this.model.answer}`;
        } else {
          this.addRow()
        }
        this.currentRow ++;
        this.currentCol = 0;
        this.currentGuess = "";
    }
}