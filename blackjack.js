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
  var cardNums;
  var success = false;

  function savePlayerData() {
    let currentPlayer = document.getElementById("username").value;
    let currentPassword = document.getElementById("password").value;

    fetch('http://localhost:8080/api/login?username=' + currentPlayer + '&password=' + currentPassword).then(function(response) {
      response.json().then(function(data) {
        let gameList = document.getElementById('gameInfo');
        let next = document.createElement('li');
        next.appendChild(document.createTextNode("Hello " + data.user + "! " + data.statement));
        gameList.appendChild(next);

        let sessIdDisp = document.getElementById('sessionId');
        let sid = document.createElement('p');
        sid.appendChild(document.createTextNode("Session ID: " + data.sessId));
        sessIdDisp.appendChild(sid);
      })
    });
  }

  /*function createCards() {
    cardNums = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
    var divDeck = document.getElementById("deck");
    for (var i = 0; i < 49; i++) {
      var divCard = document.createElement("div");
      divCard.setAttribute("id", cardNums[i].toLowerCase() + "C");
      divCard.setAttribute("target", "black");
      divDeck.appendChild(divCard);

      divCard = document.createElement("div");
      divCard.setAttribute("id", cardNums[i].toLowerCase() + "S");
      divCard.setAttribute("target", "black");
      divDeck.appendChild(divCard);

      divCard = document.createElement("div");
      divCard.setAttribute("id", cardNums[i].toLowerCase() + "D");
      divCard.setAttribute("target", "red");
      divDeck.appendChild(divCard);

      divCard = document.createElement("div");
      divCard.setAttribute("id", cardNums[i].toLowerCase() + "H");
      divCard.setAttribute("target", "red");
      divDeck.appendChild(divCard);
    }
  }*/

  function showCards() {
    playerHand.forEach((card) => {
      let rank = card.slice(0, card.indexOf(" ")).toLowerCase();
      let suit = card.slice(card.lastIndexOf(" ") + 1, card.lastIndexOf(" ") + 2);
      let cardId = rank + suit;
      let cardDiv = document.getElementById(cardId);
      cardDiv.style.display = 'block';
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

        data.playerHand.forEach((card) => {
          let rank = card.slice(0, card.indexOf(" ")).toLowerCase();
          let suit = card.slice(card.lastIndexOf(" ") + 1, card.lastIndexOf(" ") + 2);
          let cardId = rank + suit;
          let cardDiv = document.getElementById(cardId);
          cardDiv.style.display = 'block';
        })

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

        if (data.gameOver === true) {
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

        data.playerHand.forEach((card) => {
          let rank = card.slice(0, card.indexOf(" ")).toLowerCase();
          let suit = card.slice(card.lastIndexOf(" ") + 1, card.lastIndexOf(" ") + 2);
          let cardId = rank + suit;
          let cardDiv = document.getElementById(cardId);
          cardDiv.style.display = 'block';
        })
      })
    });
  }

  window.onload = function() {
    savedPlayers = localStorage.getItem("savedPlayers");
    //var userRef = firebase.database().ref('/users' + uid);
    //savedPlayers = savedPlayers ? userRef : [];
    savedPlayers = savedPlayers ? JSON.parse(savedPlayers) : [];

    //savePlayerData();

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
  //localStorage.clear();
  //document.write(localStorage.getItem("savedPlayers"));

})();
