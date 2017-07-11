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

var admin = require("firebase-admin");
var serviceAccount = require("path/to/serviceAccountKey.json");
var refreshToken; // Get refresh token from OAuth2 flow
var db = admin.database();
var ref = db.ref("server/saving-data/blackjack");
var usersRef = ref.child("users");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blackjack-5a244.firebaseio.com"
});

admin.initializeApp({
  credential: admin.credential.refreshToken(refreshToken),
  databaseURL: "https://blackjack-5a244.firebaseio.com"
});

var defaultApp = admin.initializeApp(defaultAppConfig);
console.log(defaultApp.name); // "[DEFAULT]"

var defaultAuth = defaultApp.auth();
var defaultDatabase = defaultApp.database();

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

server.on('listening', function() {
  console.log('ok, server is running');
});

server.listen(3000);

function login(url) {
  let statement = "";
  let username = url.slice(url.indexOf('username=') + 9, url.indexOf('&'));
  let password = url.slice(url.indexOf('password=') + 9);
  let sessId = JSON.stringify(new Date().getTime());
  //let userData = store.get(username);

  if (firebase.database().ref('/users/' + username)) {
    if (firebase.database().ref('/users/' + username + '/pw') === password) {
      statement = "Welcome back to Blackjack! You have " + firebase.database().ref('/users/' + username + "/win") + " win(s) and " + firebase.database().ref('/users/' + username + '/loss') + " loss(es).";
    } else {
      statement = "Your password is invalid. Refresh the page and try again." + password + " / " + userData.pw;
    }
  } else {
    usersRef.set({
      username: {
        'un': username,
        'pw': password,
        'win': 0,
        'loss': 0
      }
    });
    /*userData = {
      un: username,
      pw: password,
      sessId: sessId,
      win: 0,
      loss: 0
    };
    store.put(username, userData);*/
    statement = "Welcome to Blackjack! You can choose to 'hit' or 'stand' in the red area and you can see your hand in the blue area.";
  }

  /*console.log(sessId)
  console.log("-----")
  store.put(sessId, userData);
  console.log(JSON.stringify(store.get(sessId)));
  console.log("-----")*/
  return {
    user: username,
    pass: password,
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

function updateScore(username, bothStand, sessId) {
  let tie = false;
  let win = false;
  //let userData = store.get(username);
  usersRef = firebase.database().ref('/users/');
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
      //userData.win++;
      usersRef.child(username).update({
        "win": firebase.database().ref('/users/' + username + "/win") + 1
      });
    } else {
      //userData.loss++;
      usersRef.child(username).update({
        "loss": firebase.database().ref('/users/' + username + "/loss") + 1
      });
    }
  }
  //store.put(username, userData);
  //store.put(sessId, userData);
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
  //let userData = store.get(sessId);
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
  //let userData = store.get(sessId);
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
    stand: "You took a stand.",
    gameOver: gameOver,
    dealerHit: dealerHit,
    gameState: gameState
  };
}

function initGame(url) {
  let sessId = url.slice(url.indexOf('sessId=') + 7, url.indexOf('&'));
  let username = url.slice(url.indexOf('username=') + 9);
  //let userData = store.get(sessId);
  usersRef = firebase.database().ref('/users/' + username);

  /*console.log(sessId)
  console.log("-----")
  console.log(JSON.stringify(userData));
  console.log("-----")*/

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
