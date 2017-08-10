var currentPlayer;
var deck = [];
var dealerScore;
var playerScore;
var dealerHand = [];
var playerHand = [];
var gameOver;
var gameState = "";

var http = require('http');
var url = require('url');
var cors = require('cors');
var express = require('express');

var firebase = require('firebase');
var config = {
  apiKey: "AIzaSyBX9CyTmSz0sDhMzCd9zINumBTIfr_O1X8",
  authDomain: "blackjack-5a244.firebaseapp.com",
  databaseURL: "https://blackjack-5a244.firebaseio.com",
  projectId: "blackjack-5a244",
  storageBucket: "blackjack-5a244.appspot.com",
  messagingSenderId: "841464784637"
};
firebase.initializeApp(config);
var db = firebase.database();
var ref = db.ref('server/saving-data/blackjack');
var usersRef = ref.child('users');

var app = express();
app.use(function(req, res, next) {
  /*res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
	}
  next();*/
});

var server = http.createServer(function(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var result;

  res.setHeader('Access-Control-Allow-Origin', '*');
  if (/^\/api\/login/.test(req.url)) {
    result = login(req.url);
  } else if (/^\/api\/init/.test(req.url)) {
    result = initGame(req.url);
  } else if (/^\/api\/hit/.test(req.url)) {
    result = moveHit(req.url);
  } else if (/^\/api\/stand/.test(req.url)) {
    result = moveStand(req.url);
  } else if (/^\/api\/updatePlayers/.test(req.url)) {
    result = updatePlayerList();
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

server.on('listening', function() {
  console.log('ok, server is running');
});

server.listen(3000);

function login(url) {
  let statement = "";
  let username = url.slice(url.indexOf('username=') + 9, url.indexOf('&'));
  let password = url.slice(url.indexOf('password=') + 9);
  let sessId = JSON.stringify(new Date().getTime());
  let playerFound = false;

  usersRef.on("child_added", function(data, prevChildKey) {
    let playerInfo = data.val();
    if (playerInfo.un === username) {
      playerFound = true;
      currentPlayer = data.val();
    }
    if (playerFound) {
      if (playerInfo.pw === password) {
        statement = "Welcome back to Blackjack! You have " + playerInfo.win + " win(s) and " + playerInfo.loss + " loss(es).";
      }
    }
  }, function(err) {
    console.log(err);
  });

  if (!playerFound) {
    usersRef.update({
      [username]: {
        'un': username,
        'pw': password,
        'win': 0,
        'loss': 0
      }
    });
    statement = "Welcome to Blackjack! You can choose to 'hit' or 'stand' in the red area and you can see your hand in the blue area.";
  }

  return {
    user: username,
    statement: statement,
    sessId: sessId
  };
}

function updatePlayerList() {
  let listOfPlayers = [];

  usersRef.on("child_added", function(data, prevChildKey) {
    let playerInfo = data.val();
    listOfPlayers.push({
      un: playerInfo.un,
      win: playerInfo.win,
      loss: playerInfo.loss
    });
  }, function(err) {
    console.log(err);
  });

  return {
    listOfPlayers: listOfPlayers
  }
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

function updateScore(username, bothStand, sessId) {
  let tie = false;
  let win = false;

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
      gameState = "The dealer has a bust because his score of " + dealerScore + " is over 21. Congratulations, you win!.";
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
      gameState = "Since your score is exactly 21, you win!.";
      gameOver = true;
      win = true;
    } else {
      gameState = "Keep playing.";
      gameOver = false;
    }
  }
  if (gameOver && !tie) {
    if (win) {
      usersRef.child(username).update({
        'win': currentPlayer.win + 1
      });
    } else {
      usersRef.child(username).update({
        'loss': currentPlayer.loss + 1
      });
    }
  }
}

function randomCard(deck) {
  var index = Math.floor(Math.random() * deck.length);
  var newCard = deck[index];
  deck.splice(index, 1);
  return newCard;
}

function deal(username, sessId) {
  dealerHand.push(randomCard(deck));
  dealerHand.push(randomCard(deck));
  playerHand.push(randomCard(deck));
  playerHand.push(randomCard(deck));
  updateScore(username, false, sessId);
}

function moveHit(url) {
  let sessId = url.slice(url.indexOf('sessId=') + 7, url.indexOf('&'));
  let username = url.slice(url.indexOf('username=') + 9);
  playerHand.push(randomCard(deck));
  updateScore(username, false, sessId);
  return {
    gameOver: gameOver,
    gameState: gameState,
    playerHand: playerHand,
    playerScore: playerScore
  };
}

function moveStand(url) {
  let sessId = url.slice(url.indexOf('sessId=') + 7, url.indexOf('&'));
  let username = url.slice(url.indexOf('username=') + 9);
  let dealerHit = 0;
  while (dealerScore < 17) {
    dealerHit++;
    dealerHand.push(randomCard(deck));
    updateScore(username, false, sessId);
    if (gameOver) {
      return {
        stand: "You took a stand.",
        gameOver: gameOver,
        dealerHit: dealerHit,
        gameState: gameState
      };
    }
  }
  updateScore(username, true, sessId);
  return {
    gameOver: gameOver,
    dealerHit: dealerHit,
    gameState: gameState
  };
}

function initGame(url) {
  let sessId = url.slice(url.indexOf('sessId=') + 7, url.indexOf('&'));
  let username = url.slice(url.indexOf('username=') + 9);

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
  deal(username, sessId);
  return {
    playerHand: playerHand,
    playerScore: playerScore,
    gameOver: gameOver,
    gameState: gameState
  };
}
