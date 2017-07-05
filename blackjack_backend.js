var cardNums;
var deck = [];
var dealerScore;
var playerScore;
var dealerHand = [];
var playerHand = [];
var gameOver;
var aggWins = 0;
var timWins = 0;
var tieCount = 0;
var success = false;
var dealerHit = 0;
var gameState = "";

var http = require('http');
var url = require('url');
var Storage = require('node-storage');
var store = new Storage ('myStorage');

var server = http.createServer(function (req, res) {
  var parsedUrl = url.parse(req.url, true);
  var result;

  if (/^\/api\/init/.test(req.url)) {
    result = initGame();
  } else if (/^\/api\/hit/.test(req.url)) {
    result = moveHit();
  } else if (/^\/api\/stand/.test(req.url)) {
    result = moveStand();
  } else if (/^\/api\/dealerTurn/.test(req.url)) {
    result = dealerTurn();
  }

  if (result) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(8080);

function randomCard(deck) {
  var index = Math.floor(Math.random() * deck.length);
  var newCard = deck[index];
  deck.splice(index, 1);
  return newCard;
}

function deal() {
  dealerHand.push(randomCard(deck));
  dealerHand.push(randomCard(deck));
  playerHand.push(randomCard(deck));
  playerHand.push(randomCard(deck));

  console.log("Player Agg's cards are " + dealerHand);
  console.log("Player Tim's cards are " + playerHand);
}

function scoreWithoutAce(person, personScore) {
  personScore = 0;
  for (var i = 0; i < person.length; i++) {
    if (person[i].includes("Two")) {
      personScore += 2;
    } else if (person[i].includes("Three")) {
      personScore += 3;
    } else if (person[i].includes("Four")) {
      personScore += 4;
    } else if (person[i].includes("Five")) {
      personScore += 5;
    } else if (person[i].includes("Six")) {
      personScore += 6;
    } else if (person[i].includes("Seven")) {
      personScore += 7;
    } else if (person[i].includes("Eight")) {
      personScore += 8;
    } else if (person[i].includes("Nine")) {
      personScore += 9;
    } else if (person[i].includes("Ten") || person[i].includes("Jack") || person[i].includes("Queen") || person[i].includes("King")) {
      personScore += 10;
    }
  }
  return personScore;
}

function scoreWithAce(person, personScore) {
  for (var i = 0; i < person.length; i++) {
    if (person[i].includes("Ace")) {
      if (personScore <= 10) {
        personScore += 11;
      } else {
        personScore += 1;
      }
    }
  }
  return personScore;
}

function updateScore() {
  dealerScore = scoreWithAce(dealerHand, scoreWithoutAce(dealerHand, dealerScore));
  playerScore = scoreWithAce(playerHand, scoreWithoutAce(playerHand, playerScore));

  if (playerScore > 21) {
    gameState = "Your score of " + playerScore + " is over 21 so the game is over. You lost.";
    gameOver = true;
  } else if (dealerScore > 21) {
    gameState = "The dealer has a bust because his score of " + dealerScore + " is over 21. You win.";
    gameOver = true;
  } else if (dealerScore === 21 && playerScore === 21) {
    gameState = "Since you and the dealer both have a score of 21, the game ends in a tie.";
    gameOver = true;
  } else if (dealerScore === 21) {
    gameState = "The dealer has a score of exactly 21. You lost.";
    gameOver = true;
  } else if (playerScore === 21) {
    gameState = "Your score is exactly 21. You win.";
    gameOver = true;
  } else {
    gameOver = false;
  }
}

function moveHit() {
  playerHand.push(randomCard(deck));
  updateScore();
  return {gameOver: gameOver, gameState: gameState, playerHand: playerHand, playerScore: playerScore};
}

function moveStand() {
  return {stand: "You took a stand."};
}

function dealerTurn() {
  while (dealerScore < 17) {
      dealerHit++;
      dealerHand.push(randomCard(deck));
      updateScore();
      if (gameOver)
      {
        return {dealerHand: dealerHand, gameOver: gameOver, dealerHit: dealerHit, gameState: gameState};
      }
  }
  return {dealerHand: dealerHand, gameOver: gameOver, dealerHit: dealerHit, gameState: bothStand()};
}

function bothStand() {
  if (dealerScore > playerScore)
  {
    gameState = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". You lose.";
  }
  else if (playerScore > dealerScore)
  {
    gameState = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". Congratulations, you win!";
  }
  else if (playerScore === dealerScore) {
    gameState = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". The game ends in a tie."
  }
  return gameState;
}

function initGame() {
  cardNums = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
  deck = [];
  dealerScore = 0;
  playerScore = 0;
  dealerHand = [];
  playerHand = [];
  gameOver = false;
  for (var i = 0; i < cardNums.length; i++) {
    deck.push(cardNums[i] + " of Clubs");
    deck.push(cardNums[i] + " of Spades");
    deck.push(cardNums[i] + " of Diamonds");
    deck.push(cardNums[i] + " of Hearts");
  }
  console.log("-----NEW GAME-----");
  deal();
  updateScore();
  let sessId = new Date().getTime();
  return {sessId: sessId, playerHand: playerHand, playerScore: playerScore, dealerHand: dealerHand};
}

/*function playGame() {
  initGame();
  if (!gameOver) {
    while (playerScore < 14) {
      if (!playerTurn()) {
        updateScore();
      }
    }
    console.log("Tim took a stand.");
    while (dealerScore < 17) {
      if (!dealerTurn()) {
        updateScore();
      }
    }
    if (!gameOver) {
      console.log("Agg took a stand.");
      if (dealerScore > playerScore) {
        console.log("Tim and Agg both stood. Agg's final score is " + dealerScore + " and Tim's final score is " + playerScore + ". Tim lost.");
        aggWins++;
      } else if (dealerScore < playerScore) {
        console.log("Tim and Agg both stood. Agg's final score is " + dealerScore + " and Tim's final score is " + playerScore + ". Tim wins.");
        timWins++;
      } else if (dealerScore === playerScore) {
        console.log("Tim and Agg both stood. Agg's final score is " + dealerScore + " and Tim's final score is " + playerScore + ". The game ends in a tie.");
        tieCount++;
      }
    }
  }
}*/

/*for (var i = 0; i < 100000; i++) {
  playGame();
}
console.log("Game percetages: Agg - " + aggWins / 100000 * 100 + ", Tim - " + timWins / 100000 * 100 + ", ties - " + tieCount / 100000 * 100);*/
