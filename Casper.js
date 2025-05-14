function rollDice() {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
}
let diceRolls = rollDice();
let heldDice = [false, false, false, false, false];
let rollsLeft = 3;
let scores = {
    eenen: null, tweeën: null, drieën: null, vieren: null, vijfen: null, zessen: null,
    threeOfKind: null, fourOfKind: null, fullHouse: null, kleineStraat: null, groteStraat: null,
    yahtzee: null, chance: null, totaal: 0
};//

function rollNewDice() {
    if (rollsLeft > 0) {
        diceRolls = diceRolls.map((val, i) => heldDice[i] ? val : Math.floor(Math.random() * 6) + 1);
        rollsLeft--;
        updateDisplay();
    } else {
        alert("Geen worpen meer!");
        document.getElementById("calculateScoreBtn").style.display = "inline-block";
    }
}

function calculateFinalScore() {
    let possibleScores = calculatePossibleScores();
    let maxScore = 0;
    let bestCategory = null;

    Object.keys(possibleScores).forEach(category => {
        if (possibleScores[category] > maxScore && scores[category] === null) {
            maxScore = possibleScores[category];
            bestCategory = category;
        }
    });

    if (bestCategory) {
        scores[bestCategory] = maxScore;
        updateScores();
    } else {
        alert("Er zijn geen scores beschikbaar om toe te voegen!");
    }

    resetTurn();
    document.getElementById("calculateScoreBtn").style.display = "none"; 
}//

// Update de weergave van de scores
function updateScores() {
    Object.keys(scores).forEach(key => {
        let scoreCell = document.getElementById(key);
        scoreCell.textContent = scores[key] !== null ? scores[key] : "-";
        scoreCell.style.color = scores[key] !== null ? "gray" : "black";
    });
}//


function toggleHold(index) {
    heldDice[index] = !heldDice[index];
    updateDisplay();
}

function calculatePossibleScores() {
    let counts = {};
    diceRolls.forEach(die => counts[die] = (counts[die] || 0) + 1);
    let possibleScores = {};
    
    for (let i = 1; i <= 6; i++) {
        possibleScores[["eenen", "tweeën", "drieën", "vieren", "vijfen", "zessen"][i - 1]] = (counts[i] || 0) * i;
    }
    
    possibleScores.threeOfKind = Object.values(counts).some(count => count >= 3) ? diceRolls.reduce((a, b) => a + b, 0) : 0;
    possibleScores.fourOfKind = Object.values(counts).some(count => count >= 4) ? diceRolls.reduce((a, b) => a + b, 0) : 0;
    possibleScores.fullHouse = Object.values(counts).includes(3) && Object.values(counts).includes(2) ? 25 : 0;
    let uniqueDice = [...new Set(diceRolls)].sort();
    let smallStraightPatterns = [[1,2,3,4], [2,3,4,5], [3,4,5,6]];
    let largeStraightPatterns = [[1,2,3,4,5], [2,3,4,5,6]];
    possibleScores.kleineStraat = smallStraightPatterns.some(p => p.every(n => uniqueDice.includes(n))) ? 30 : 0;
    possibleScores.groteStraat = largeStraightPatterns.some(p => p.every(n => uniqueDice.includes(n))) ? 40 : 0;
    possibleScores.yahtzee = Object.values(counts).includes(5) ? 50 : 0;
    possibleScores.chance = diceRolls.reduce((a, b) => a + b, 0);
    
    return possibleScores;
};//

// Score plaatsen
function placeScore(category) {
    if (scores[category] !== null) {
        alert("Deze categorie is al gekozen!");
        return;
    }
    let possibleScores = calculatePossibleScores();
    scores[category] = possibleScores[category];

    scores.totaal = Object.keys(scores)
        .filter(key => key !== "totaal")
        .map(key => scores[key] || 0)
        .reduce((a, b) => a + b, 0);

    resetTurn();
    updateScores();
}

function updateDisplay() {
    document.querySelectorAll(".dice").forEach((el, i) => {
        el.textContent = diceRolls[i];
        el.style.backgroundColor = heldDice[i] ? "lightgreen" : "white";
    });
    document.getElementById("rollsLeft").textContent = `Worpen over: ${rollsLeft}`;
}

function updateScores() {
    const possibleScores = calculatePossibleScores();
    Object.keys(scores).forEach(key => {
        let scoreCell = document.getElementById(key);
        if (key !== "totaal") {
            scoreCell.textContent = scores[key] !== null ? scores[key] : possibleScores[key] || "-";
        }
        scoreCell.style.color = scores[key] !== null ? "gray" : "black";
    });
    scores.totaal = Object.values(scores).reduce((total, score) => {
        return total + (score !== null ? score : 0);
    }, 0);

    document.getElementById('totaal').textContent = scores.totaal;
}

document.addEventListener("DOMContentLoaded", () => {
    Object.keys(scores).forEach(key => {
        let cell = document.getElementById(key);
        if (cell && key !== "totaal") {
            cell.addEventListener("click", () => placeScore(key));
        }
    });
});

function resetTurn() {
    if (rollsLeft === 3) {  
        alert("Mag niet resetten zonder score te plaatsen");
        return;
    }
    
    rollsLeft = 3;
    diceRolls = rollDice();
    heldDice.fill(false); 
    updateDisplay(); 
}//
