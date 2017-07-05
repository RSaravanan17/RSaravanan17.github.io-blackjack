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
  var deck;
  var dealerScore;
  var playerScore;
  var dealerHand;
  var playerHand;
  var gameOver;
  var savedPlayers = [{
    playerName: "Test",
    savedWins: 5
  }];
  var success = false;
  var dealerHit = false;
  //var nameOfPlayer;
  var wins = 0;
  var playerIndex;
  //var uid;

  function savePlayerData() {
    let currentPlayer = document.getElementById("username").value;
    let currentPassword = document.getElementById("password").value;

    console.log(currentPlayer + " " + currentPassword);
    /*//success = savedPlayers.find(x => x.playerName === currentPlayer) === undefined ? false : true;
    for (var i = 0; i < savedPlayers.length; i++) {
      if (savedPlayers[i].playerName === currentPlayer) {
        success = true;
        playerIndex = i;
      }
    }

    if (!success) {
      savedPlayers.push({
        playerName: currentPlayer,
        savedWins: 0
      });
      localStorage.setItem("savedPlayers", JSON.stringify(savedPlayers));
      //var newPostRef = firebase.database().ref().push({
      //  playerName: currentPlayer,
      //  savedWins: 0
      //});
      //firebase.database().ref().update({
      //  "savedPlayers": savedPlayers
      //});
      playerIndex = savedPlayers.length - 1;
      //uid = newPostRef.key;
      window.alert("Hello " + currentPlayer + ", welcome to Blackjack! You are a new player and you have not won any games yet. In this simulation of Blackjack, the green box displays the gameplay, the red box displays the moves you can make, and the blue box displays your current hand. Enjoy!");
    } else {
      //How do I access the current player's uid if he is a returning player with an existing uid?
      //postSnapshot.val().uid;
      wins = savedPlayers[playerIndex].savedWins;
      window.alert("Hello " + currentPlayer + ", welcome back to Blackjack! You are a returning player and you have won " + wins + " game(s).");
    }*/
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
    fetch('http://localhost:8080/api/hit').then(function(response) {
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
      fetch('http://localhost:8080/api/stand').then(function(response) {
        response.json().then(function(data) {
            let gameList = document.getElementById('gameInfo');
            let next = document.createElement('li');
            next.appendChild(document.createTextNode(data.stand));
            gameList.appendChild(next);

              fetch('http://localhost:8080/api/dealerTurn').then(function(response) {
                response.json().then(function(data) {
                  if (data.gameOver === true) {
                    let gameList = document.getElementById('gameInfo');
                    let next = document.createElement('li');
                    next.appendChild(document.createTextNode("The dealer took " + data.dealerHit + " hit(s). The game is over. " + data.gameState));
                    gameList.appendChild(next);
                  }
                  else {
                    let gameList = document.getElementById('gameInfo');
                    let next = document.createElement('li');
                    next.appendChild(document.createTextNode("The dealer took " + data.dealerHit + " hit(s) and then stood. " + data.gameState));
                    gameList.appendChild(next);
                  }
                  disableButtons();
                })
              });
        })
      });

      /*while (dealerScore < 17) {
        if (!dealerTurn()) {
          updateScore();
        }
      }

      if (!gameOver) {
        let gameList1 = document.getElementById('gameInfo');
        let next1 = document.createElement('li');
        next1.appendChild(document.createTextNode("The dealer took a stand"));
        gameList1.appendChild(next1);

        disableButtons();

        if (dealerScore > playerScore) {
          let gameList = document.getElementById('gameInfo');
          let next = document.createElement('li');
          next.appendChild(document.createTextNode("Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". You lose."));
          gameList.appendChild(next);
        } else if (dealerScore < playerScore) {
          let gameList = document.getElementById('gameInfo');
          let next = document.createElement('li');
          next.appendChild(document.createTextNode("Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". Congratulations, you win!"));
          gameList.appendChild(next);

          savedPlayers[playerIndex].savedWins++;
          localStorage.setItem("savedPlayers", JSON.stringify(savedPlayers));
          firebase.database().ref().update({
            "savedPlayers": savedPlayers
          });
        } else if (dealerScore === playerScore) {
          let gameList = document.getElementById('gameInfo');
          let next = document.createElement('li');
          next.appendChild(document.createTextNode("Since you and the dealer both took a stand, the game is over. The dealer's final score is " + dealerScore + " and your final score is " + playerScore + ". The game ends in a tie."));
          gameList.appendChild(next);
        }
      } else {
        let gameList = document.getElementById('gameInfo');
        let next = document.createElement('li');
        next.appendChild(document.createTextNode("The game is over. Reload the page to play again."));
        gameList.appendChild(next);
      }*/
  }

  function initGame() {
    fetch('http://localhost:8080/api/init').then(function(response) {
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
