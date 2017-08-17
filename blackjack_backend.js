var blackjack_backend = (function() {
  var currentPlayer = [];
  var deck = [];
  var dealerScore = [];
  var playerScore = [];
  var dealerHand = [];
  var playerHand = [];
  var gameOver = [];
  var gameState = [];

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
    let sessId = JSON.stringify(new Date().getTime());
    let statement = [];
    statement[sessId] = "";
    let username = url.slice(url.indexOf('username=') + 9, url.indexOf('&'));
    let password = url.slice(url.indexOf('password=') + 9);
    let playerFound = [];
    playerFound[sessId] = false;

    usersRef.on("child_added", function(data, prevChildKey) {
      let playerInfo = [];
      playerInfo[sessId] = data.val();
      if (playerInfo[sessId].un === username) {
        playerFound[sessId] = true;
        currentPlayer[sessId] = data.val();
      }
      if (playerFound[sessId]) {
        if (playerInfo[sessId].pw === password) {
          statement[sessId] = "Welcome back to Blackjack! You have " + playerInfo[sessId].win + " win(s) and " + playerInfo[sessId].loss + " loss(es).";
        }
      }
    }, function(err) {
      console.log(err);
    });

    if (!playerFound[sessId]) {
      usersRef.update({
        [username]: {
          'un': username,
          'pw': password,
          'win': 0,
          'loss': 0
        }
      });
      statement[sessId] = "Welcome to Blackjack! You can choose to 'hit' or 'stand' in the red area and you can see your hand in the blue area.";
    }

    return {
      user: username,
      statement: statement[sessId],
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

  function scoreWithoutAce(currentDeck, score) {
    score = 0;
    for (var i = 0; i < currentDeck.length; i++) {
      if (currentDeck[i].includes("Two")) {
        score += 2;
      } else if (currentDeck[i].includes("Three")) {
        score += 3;
      } else if (currentDeck[i].includes("Four")) {
        score += 4;
      } else if (currentDeck[i].includes("Five")) {
        score += 5;
      } else if (currentDeck[i].includes("Six")) {
        score += 6;
      } else if (currentDeck[i].includes("Seven")) {
        score += 7;
      } else if (currentDeck[i].includes("Eight")) {
        score += 8;
      } else if (currentDeck[i].includes("Nine")) {
        score += 9;
      } else if (currentDeck[i].includes("Ten") || currentDeck[i].includes("Jack") || currentDeck[i].includes("Queen") || currentDeck[i].includes("King")) {
        score += 10;
      }
    }
    return score;
  }

  function scoreWithAce(currentDeck, score) {
    for (var i = 0; i < currentDeck.length; i++) {
      if (currentDeck[i].includes("Ace")) {
        if (score <= 10) {
          score += 11;
        } else {
          score += 1;
        }
      }
    }
    return score;
  }

  function updateScore(username, bothStand, sessId) {
    gameState[sessId] = "";
    let tie = [];
    tie[sessId] = false;
    let win = [];
    win[sessId] = false;

    dealerScore[sessId] = scoreWithAce(dealerHand[sessId], scoreWithoutAce(dealerHand[sessId], dealerScore[sessId]));
    playerScore[sessId] = scoreWithAce(playerHand[sessId], scoreWithoutAce(playerHand[sessId], playerScore[sessId]));

    if (bothStand) {
      gameOver[sessId] = true;
      if (dealerScore[sessId] > playerScore[sessId]) {
        gameState[sessId] = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore[sessId] + " and your final score is " + playerScore + ". You lose.";
      } else if (playerScore[sessId] > dealerScore[sessId]) {
        gameState[sessId] = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore[sessId] + " and your final score is " + playerScore + ". Congratulations, you win!";
        win[sessId] = true;
      } else if (playerScore[sessId] === dealerScore[sessId]) {
        gameState[sessId] = "Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore[sessId] + " and your final score is " + playerScore + ". The game ends in a tie.";
        tie[sessId] = true;
      }
    } else {
      if (playerScore[sessId] > 21) {
        gameState[sessId] = "Your score of " + playerScore[sessId] + " is over 21 so the game is over. You lost.";
        gameOver[sessId] = true;
      } else if (dealerScore[sessId] > 21) {
        gameState[sessId] = "The dealer has a bust because his score of " + dealerScore[sessId] + " is over 21. Congratulations, you win!";
        gameOver[sessId] = true;
        win[sessId] = true;
      } else if (dealerScore[sessId] === 21 && playerScore[sessId] === 21) {
        gameState[sessId] = "Since you and the dealer both have a score of 21, the game ends in a tie.";
        gameOver[sessId] = true;
        tie[sessId] = true;
      } else if (dealerScore[sessId] === 21) {
        gameState[sessId] = "The dealer has a score of exactly 21. You lost.";
        gameOver[sessId] = true;
      } else if (playerScore[sessId] === 21) {
        gameState[sessId] = "Since your score is exactly 21, you win!.";
        gameOver[sessId] = true;
        win[sessId] = true;
      } else {
        gameState[sessId] = "Continue playing.";
        gameOver[sessId] = false;
      }
    }
    if (gameOver[sessId] && !tie[sessId]) {
      if (win[sessId]) {
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

  function randomCard(currentDeck, sessId) {
    var index = Math.floor(Math.random() * currentDeck.length);
    var newCard = currentDeck[index];
    deck[sessId].splice(index, 1);
    return newCard;
  }

  function deal(username, sessId) {
    dealerHand[sessId].push(randomCard(deck[sessId], sessId), randomCard(deck[sessId], sessId));
    playerHand[sessId].push(randomCard(deck[sessId], sessId), randomCard(deck[sessId], sessId));
    updateScore(username, false, sessId);
  }

  function moveHit(url) {
    let sessId = url.slice(url.indexOf('sessId=') + 7, url.indexOf('&'));
    let username = url.slice(url.indexOf('username=') + 9);
    playerHand[sessId].push(randomCard(deck[sessId], sessId));
    updateScore(username, false, sessId);
    return {
      gameOver: gameOver[sessId],
      gameState: gameState[sessId],
      playerHand: playerHand[sessId],
      playerScore: playerScore[sessId]
    };
  }

  function moveStand(url) {
    let sessId = url.slice(url.indexOf('sessId=') + 7, url.indexOf('&'));
    let username = url.slice(url.indexOf('username=') + 9);
    let dealerHit = [];
    dealerHit[sessId] = 0;
    while (dealerScore[sessId] < 17) {
      dealerHit[sessId]++;
      dealerHand[sessId].push(randomCard(deck[sessId], sessId));
      updateScore(username, false, sessId);
      if (gameOver[sessId] && dealerScore[sessId] > 21) {
        return {
          gameOver: gameOver[sessId],
          dealerHit: dealerHit[sessId],
          gameState: gameState[sessId],
          bust: true
        };
      }
    }
    updateScore(username, true, sessId);
    return {
      gameOver: gameOver[sessId],
      dealerHit: dealerHit[sessId],
      gameState: gameState[sessId],
      bust: false
    };
  }

  function initGame(url) {
    let sessId = url.slice(url.indexOf('sessId=') + 7, url.indexOf('&'));
    let username = url.slice(url.indexOf('username=') + 9);

    let cardNums = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
    deck.push({sessId: []});
    deck[sessId] = [];
    dealerScore.push({sessId: 0});
    dealerScore[sessId] = 0;
    playerScore.push({sessId: 0});
    playerScore[sessId] = 0;
    dealerHand.push({sessId: []});
    dealerHand[sessId] = [];
    playerHand.push({sessId: []});
    playerHand[sessId] = [];
    gameOver.push({sessId: false});
    gameOver[sessId] = false;
    for (var i = 0; i < cardNums.length; i++) {
      deck[sessId].push(cardNums[i] + " of Clubs", cardNums[i] + " of Spades", cardNums[i] + " of Diamonds", cardNums[i] + " of Hearts");
    }
    deal(username, sessId);
    return {
      playerHand: playerHand[sessId],
      playerScore: playerScore[sessId],
      gameOver: gameOver[sessId],
      gameState: gameState[sessId]
    };
  }
})();
