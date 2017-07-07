/*var firebase = require('firebase/app');
require('firebase/database');*/
//var firebase = new Firebase('https://blackjack-5a244.firebaseio.com/');
//var database = firebase.database();
/*var config = {
  apiKey: "AIzaSyBX9CyTmSz0sDhMzCd9zINumBTIfr_O1X8",
  authDomain: "blackjack-5a244.firebaseapp.com",
  databaseURL: "https://blackjack-5a244.firebaseio.com",
  projectId: "blackjack-5a244",
  storageBucket: "blackjack-5a244.appspot.com",
  messagingSenderId: "841464784637"
};
firebase.initializeApp(config);*/

var bj = (function() {
  function savePlayerData() {
    let currentPlayer = document.getElementById("username").value;
    let currentPassword = document.getElementById("password").value;

    fetch('http://localhost:8080/api/login?username=' + currentPlayer + '&password=' + currentPassword).then(function(response) {
      response.json().then(function(data) {
        let gameList = document.getElementById('gameInfo');
        let next = document.createElement('li');
        next.appendChild(document.createTextNode("Hello " + data.user + "! " + data.statement));
        gameList.appendChild(next);

        //let sessIdDisp = document.getElementById('sessionId');
        document.getElementById('sessionId').innerHTML = "Session ID: " + data.sessId;
        //sessIdDisp.appendChild(document.createTextNode("Session ID: " + data.sessId));
      })
    });
  }

  /*function createCards() {
    let cardNums = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
    let cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    var divDeck = document.getElementById("deck");
    for (var i = 0; i < 49; i++) {
      let divCard;
      for (var j = 0; j < 13; i++) {
        divCard = document.createElement("div");
        divCard.setAttribute("id", cardNums[i].toLowerCase() + "C");
        divCard.setAttribute("target", "black");
        divCard.appendChild(document.createTextNode(cardValues[j] + "♣"));
        divDeck.appendChild(divCard);
      }

      for (var j = 0; j < 13; i++) {
        divCard = document.createElement("div");
        divCard.setAttribute("id", cardNums[i].toLowerCase() + "S");
        divCard.setAttribute("target", "black");
        divCard.appendChild(document.createTextNode(cardValues[j] + "♠"));
        divDeck.appendChild(divCard);
      }

      for (var j = 0; j < 13; i++) {
        divCard = document.createElement("div");
        divCard.setAttribute("id", cardNums[i].toLowerCase() + "D");
        divCard.setAttribute("target", "red");
        divCard.appendChild(document.createTextNode(cardValues[j] + "♦"));
        divDeck.appendChild(divCard);
      }

      for (var j = 0; j < 13; i++) {
        divCard = document.createElement("div");
        divCard.setAttribute("id", cardNums[i].toLowerCase() + "H");
        divCard.setAttribute("target", "red");
        divCard.appendChild(document.createTextNode(cardValues[j] + "♥"));
        divDeck.appendChild(divCard);
      }
    }
  }*/

  function showCards(playerHand) {
    playerHand.forEach((card) => {
      let cardNums = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
      let cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

      let rank = card.slice(0, card.indexOf(" "));
      let suit = card.slice(card.lastIndexOf(" ") + 1, card.lastIndexOf(" ") + 2);
      let cardId = rank.toLowerCase() + suit;
      let color = suit === "C" || "S" ? "black" : "red";
      let cardName = cardValues[cardNums.indexOf(rank)];
      let symbol = suit === "C" ? "♣" : suit === "S" ? "♠" : suit === "D" ? "♦" : "♥";

      divCard = document.createElement("div");
      divCard.setAttribute("id", cardId);
      divCard.setAttribute("target", color);
      divCard.appendChild(document.createTextNode(cardName + symbol));
      divDeck.appendChild(divCard);

      /*let rank = card.slice(0, card.indexOf(" ")).toLowerCase();
      let suit = card.slice(card.lastIndexOf(" ") + 1, card.lastIndexOf(" ") + 2);
      let cardId = rank + suit;
      let cardDiv = document.getElementById(cardId);
      cardDiv.style.display = 'block';*/
    })
  }

  function disableButtons() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
  }

  function moveHit() {
    let sessId = document.getElementById('sessionId').innerHTML;
    fetch('http://localhost:8080/api/hit?sessId=' + sessId).then(function(response) {
      response.json().then(function(data) {
        let gameList = document.getElementById('gameInfo');
        let next = document.createElement('li');
        next.appendChild(document.createTextNode("You took a hit. Your cards are now " + JSON.stringify(data.playerHand) + ". Your score is " + data.playerScore + "."));
        gameList.appendChild(next);

        /*data.playerHand.forEach((card) => {
          let rank = card.slice(0, card.indexOf(" ")).toLowerCase();
          let suit = card.slice(card.lastIndexOf(" ") + 1, card.lastIndexOf(" ") + 2);
          let cardId = rank + suit;
          let cardDiv = document.getElementById(cardId);
          cardDiv.style.display = 'block';
        })*/
        showCards(data.playerHand);

        if (data.gameOver) {
          let gameList1 = document.getElementById('gameInfo');
          let next1 = document.createElement('li');
          next1.appendChild(document.createTextNode(data.gameState));
          gameList1.appendChild(next1);

          disableButtons();
        }
      });
    });
  }

  function moveStand() {
    let sessId = document.getElementById('sessionId').innerHTML;
    fetch('http://localhost:8080/api/stand?sessId=' + sessId).then(function(response) {
      response.json().then(function(data) {
        let gameList1 = document.getElementById('gameInfo');
        let next1 = document.createElement('li');
        next1.appendChild(document.createTextNode(data.stand));
        gameList1.appendChild(next1);

        if (data.gameOver) {
          let gameList = document.getElementById('gameInfo');
          let next = document.createElement('li');
          next.appendChild(document.createTextNode("The dealer took " + data.dealerHit + " hit(s). The game is over. " + data.gameState));
          gameList.appendChild(next);
        } else {
          let gameList = document.getElementById('gameInfo');
          let next = document.createElement('li');
          next.appendChild(document.createTextNode("The dealer took " + data.dealerHit + " hit(s) and then stood. " + data.gameState));
          gameList.appendChild(next);
        }
        disableButtons();
      })
    });
  }

  function initGame() {
    let sessId = document.getElementById('sessionId').innerHTML;
    fetch('http://localhost:8080/api/init?sessId=' + sessId).then(function(response) {
      response.json().then(function(data) {
        let gameList = document.getElementById('gameInfo');
        let next = document.createElement('li');
        next.appendChild(document.createTextNode("Your cards are " + JSON.stringify(data.playerHand) + ". Your score is " + data.playerScore + "."));
        gameList.appendChild(next);

        /*data.playerHand.forEach((card) => {
          let rank = card.slice(0, card.indexOf(" ")).toLowerCase();
          let suit = card.slice(card.lastIndexOf(" ") + 1, card.lastIndexOf(" ") + 2);
          let cardId = rank + suit;
          let cardDiv = document.getElementById(cardId);
          cardDiv.style.display = 'block';
        })*/
        showCards(data.playerHand);
      })
    });
  }

  window.onload = function() {
    //var userRef = firebase.database().ref('/users' + uid);
    //savedPlayers = savedPlayers ? userRef : [];

    //document.getElementById('username').disabled = true;
    //document.getElementById('password').disabled = true;

    let submit = document.getElementById('submit');
    submit.onclick = function() {
      savePlayerData();
      document.getElementById('submit').disabled = true;
      document.getElementById('username').disabled = false;
      document.getElementById('password').disabled = false;
      initGame();
    };
  }

  return {
    "moveHit": moveHit,
    "moveStand": moveStand
  };
})();
