var deck = [];
var dealerScore;
var playerScore;
var dealerHand = [];
var playerHand = [];
var gameOver;
var gameState = "";

var http = require('http');
var url = require('url');
var Storage = require('node-storage');
var store = new Storage('myStorage');

var server = http.createServer(function(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var result;

  if (/^\/api\/init/.test(req.url)) {
    result = initGame(req.url);
  } else if (/^\/api\/hit/.test(req.url)) {
    result = moveHit(req.url);
  } else if (/^\/api\/stand/.test(req.url)) {
    result = moveStand(req.url);
  } else if (/^\/api\/login/.test(req.url)) {
    result = login(req.url);
  }

  if (result) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(result));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(8080);

function login(url) {
  let statement = "";
  let username = url.slice(url.indexOf('username=') + 9, url.indexOf('&'));
  let password = url.slice(url.indexOf('password=') + 9);
  let sessId = JSON.stringify(new Date().getTime());
  let userData = store.get(username);
  if (userData) {
    if (userData.pw === password) {
      statement = "Welcome back to Blackjack! You have " + store.get(username + '.win') + " win(s) and " + store.get(username + '.loss') + " loss(es).";
    } else {
      statement = "Your password is invalid. Refresh the page and try again." + password + " / " + userData.pw;
    }
  } else {
    userData = {
      un: username,
      pw: password,
      sessId: sessId,
      win: 0,
      loss: 0
    };
    store.put(username, userData);
    statement = "Welcome to Blackjack! You can choose to 'hit' or 'stand' in the red area and you can see your hand in the blue area.";
  }

  store.put(sessId, userData);
  return {
    user: username,
    statement: statement,
    sessId: sessId
  };
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

function updateScore(username, bothStand) {
  let tie = false;
  let win = false;
  let userData = JSON.parse(store.get(username));
  dealerScore = scoreWithAce(dealerHand, scoreWithoutAce(dealerHand, dealerScore));
  playerScore = scoreWithAce(playerHand, scoreWithoutAce(playerHand, playerScore));

  if (bothStand) {
    gameOver = true;
    if (dealerScore > playerScore) {
      gameState = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". You lose.";
    } else if (playerScore > dealerScore) {
      gameState = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". Congratulations, you win!";
      win = true;
    } else if (playerScore === dealerScore) {
      gameState = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". The game ends in a tie.";
      tie = true;
    }
  } else {
    if (playerScore > 21) {
      gameState = "Your score of " + playerScore + " is over 21 so the game is over. You lost.";
      gameOver = true;
    } else if (dealerScore > 21) {
      gameState = "The dealer has a bust because his score of " + dealerScore + " is over 21. You win.";
      gameOver = true;
      win = true;
    } else if (dealerScore === 21 && playerScore === 21) {
      gameState = "Since you and the dealer both have a score of 21, the game ends in a tie.";
      gameOver = true;
      tie = true;
    } else if (dealerScore === 21) {
      gameState = "The dealer has a score of exactly 21. You lost.";
      gameOver = true;
    } else if (playerScore === 21) {
      gameState = "Your score is exactly 21. You win.";
      gameOver = true;
      win = true;
    } else {
      gameOver = false;
    }
  }
  if (gameOver && !tie) {
    if (win) {
      userData.win++;
    } else {
      userData.loss++;
    }
  }
  store.put(username, JSON.stringify(userData));
  store.put(sessId, JSON.stringify(userData));
}

function randomCard(deck) {
  var index = Math.floor(Math.random() * deck.length);
  var newCard = deck[index];
  deck.splice(index, 1);
  return newCard;
}

function deal(username) {
  dealerHand.push(randomCard(deck));
  dealerHand.push(randomCard(deck));
  playerHand.push(randomCard(deck));
  playerHand.push(randomCard(deck));
  updateScore(username, false);
}

function moveHit(url) {
  let sessId = url.slice(url.indexOf('sessId=') + 7);
  let userData = JSON.parse(store.get(sessId));
  playerHand.push(randomCard(deck));
  updateScore(userData.username, false);
  return {
    gameOver: gameOver,
    gameState: gameState,
    playerHand: playerHand,
    playerScore: playerScore
  };
}

function moveStand(url) {
  let sessId = url.slice(url.indexOf('sessId=') + 7);
  let userData = JSON.parse(store.get(sessId));
  let dealerHit = 0;
  while (dealerScore < 17) {
    dealerHit++;
    dealerHand.push(randomCard(deck));
    updateScore(userData.username, false);
    if (gameOver) {
      return {
        stand: "You took a stand.",
        gameOver: gameOver,
        dealerHit: dealerHit,
        gameState: gameState
      };
    }
  }
  updateScore(userData.username, true);
  return {
    stand: "You took a stand.",
    gameOver: gameOver,
    dealerHit: dealerHit,
    gameState: gameState
  };
}

/*function bothStand(username) {
  let userData = JSON.parse(store.get(username));
  let gameState = "";
  let win = false;
  let tie = false;
  if (dealerScore > playerScore) {
    gameState = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". You lose.";
  } else if (playerScore > dealerScore) {
    gameState = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". Congratulations, you win!";
    win = true;
  } else if (playerScore === dealerScore) {
    gameState = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". The game ends in a tie.";
    tie = true;
  }
  if (win) {
    userData.win++;
  } else if (!tie) {
    userData.loss++;
  }
  store.put(username, JSON.stringify(userData));
  store.put(sessId, JSON.stringify(userData));

  return gameState;
}*/

function initGame(url) {
  let sessId = url.slice(url.indexOf('sessId=') + 7);
  let userData = JSON.parse(store.get(sessId));
  let cardNums = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
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
  deal(userData.username);
  updateScore(userData.username);
  return {
    playerHand: playerHand,
    playerScore: playerScore
  };
}
