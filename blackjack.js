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

  function deal() {
    dealerHand.push(randomCard(deck));
    dealerHand.push(randomCard(deck));
    playerHand.push(randomCard(deck));
    playerHand.push(randomCard(deck));

    let gameList = document.getElementById('gameInfo');
    let next = document.createElement('li');
    next.appendChild(document.createTextNode("One of the dealer's cards is " + dealerHand[Math.round(Math.random())] + "."));
    gameList.appendChild(next);

    let gameList1 = document.getElementById('gameInfo');
    let next1 = document.createElement('li');
    next1.appendChild(document.createTextNode("Your cards are " + playerHand + "."));
    gameList1.appendChild(next1);
    showCards();
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

  function disableButtons() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
  }

  function updateScore() {
    dealerScore = scoreWithAce(dealerHand, scoreWithoutAce(dealerHand, dealerScore));
    playerScore = scoreWithAce(playerHand, scoreWithoutAce(playerHand, playerScore));

    let gameList = document.getElementById('gameInfo');
    let next = document.createElement('li');
    next.appendChild(document.createTextNode("Your current score is " + playerScore + "."));
    gameList.appendChild(next);

    if (playerScore > 21) {
      let gameList = document.getElementById('gameInfo');
      let next = document.createElement('li');
      next.appendChild(document.createTextNode("Bust! Your score of " + playerScore + " is over 21 so the game is over. You lost."));
      gameList.appendChild(next);

      disableButtons();
      gameOver = true;
    } else if (dealerScore > 21) {
      let gameList = document.getElementById('gameInfo');
      let next = document.createElement('li');
      next.appendChild(document.createTextNode("Congratulations! The dealer has a bust because his score of " + dealerScore + " is over 21. You win!"));
      gameList.appendChild(next);

      disableButtons();
      gameOver = true;

      savedPlayers[playerIndex].savedWins++;
      localStorage.setItem("savedPlayers", JSON.stringify(savedPlayers));
      /*firebase.database().ref().update({
        "savedPlayers": savedPlayers
      });*/
    } else if (dealerScore === 21 && playerScore === 21) {
      let gameList = document.getElementById('gameInfo');
      let next = document.createElement('li');
      next.appendChild(document.createTextNode("Since you and the dealer both have a score of 21, the game ends in a tie."));
      gameList.appendChild(next);

      disableButtons();
      gameOver = true;
    } else if (dealerScore === 21) {
      let gameList = document.getElementById('gameInfo');
      let next = document.createElement('li');
      next.appendChild(document.createTextNode("The dealer has a score of exactly 21. You lost."));
      gameList.appendChild(next);

      disableButtons();
      gameOver = true;
    } else if (playerScore === 21) {
      let gameList = document.getElementById('gameInfo');
      let next = document.createElement('li');
      next.appendChild(document.createTextNode("Congratulations! Your score is exactly 21. You win!"));
      gameList.appendChild(next);

      disableButtons();
      gameOver = true;

      savedPlayers[playerIndex].savedWins++;
      localStorage.setItem("savedPlayers", JSON.stringify(savedPlayers));
      /*firebase.database().ref().update({
        "savedPlayers": savedPlayers
      });*/
    } else {
      gameOver = false;
    }
  }

  function fetchHit() {
    return fetch('http://localhost:8080/api/hit').then(function(response) {
      return response.json().then(function(data) {
         return data.playerHand;
      });
    });
  }

  function moveHit() {
    //playerHand.push(randomCard(deck));
    playerHand = fetchHit().then(function(result){
      return result.playerHand;
    });

    console.log(playerHand);
    let gameList = document.getElementById('gameInfo');
    let next = document.createElement('li');
    next.appendChild(document.createTextNode("You took a hit. Your cards are now " + playerHand + "."));
    gameList.appendChild(next);

    //showCards();
    updateScore();
  }

  function dealerTurn() {
    fetch('http://localhost:8080/api/dealerTurn').then(function(response) {
      response.json().then(function(data) {
        if (dealerScore < 17) {
          dealerHand = data.dealerHand;
          dealerHit = data.dealerHit;
          let gameList = document.getElementById('gameInfo');
          let next = document.createElement('li');
          next.appendChild(document.createTextNode(data.dealerMove));
          gameList.appendChild(next);

          updateScore();
        } else {
          if (!gameOver) {
            let gameList = document.getElementById('gameInfo');
            let next = document.createElement('li');
            next.appendChild(document.createTextNode("The dealer took a stand."));
            gameList.appendChild(next);
          }
        }
      });
    });
    /*dealerHit ?
      return true: return false;*/
    return dealerHit;
  }

  function fetchStand() {
    return fetch('http://localhost:8080/api/stand').then(function(response) {
      return response.json().then(function(data) {
        return data.stand;
      })
    });
  }

  function moveStand() {
    if (!gameOver) {
      var stand = fetchStand().then(function(result){
        return result;
      });

      console.log(stand);
      let gameList = document.getElementById('gameInfo');
      let next = document.createElement('li');
      next.appendChild(document.createTextNode(stand));
      gameList.appendChild(next);

      while (dealerScore < 17) {
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
          /*firebase.database().ref().update({
            "savedPlayers": savedPlayers
          });*/
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
      }
    }
  }

  function initGame() {
    return fetch('http://localhost:8080/api/init').then(function(response) {
      return response.json().then(function(data) {
        deck = data.deck;
        playerHand = data.playerHand;
        dealerHand = data.dealerHand;
        return {deck: data.deck, playerHand: data.playerHand, dealerHand: data.dealerHand};
      })
    });

    /*deck = [];
    dealerScore = 0;
    playerScore = 0;
    dealerHand = [];
    playerHand = [];
    gameOver = false;*/
  }

  /*initGame().then(function(response){
    let gameList = document.getElementById('gameInfo');
    let next = document.createElement('li');
    next.appendChild(document.createTextNode(playerHand + " " + dealerHand));
    gameList.appendChild(next);
  });*/

  window.onload = function() {
    savedPlayers = localStorage.getItem("savedPlayers");
    //var userRef = firebase.database().ref('/users' + uid);
    //savedPlayers = savedPlayers ? userRef : [];
    savedPlayers = savedPlayers ? JSON.parse(savedPlayers) : [];

    //savePlayerData();
    playerHand = initGame().then(function(result){
      return result.playerHand;
    });
    let gameList = document.getElementById('gameInfo');
    let next = document.createElement('li');
    next.appendChild(document.createTextNode(playerHand + " "));
    gameList.appendChild(next);
    console.log(initGame());
  }

  return {
    "moveHit": moveHit,
    "moveStand": moveStand
  };
  //localStorage.clear();
  //document.write(localStorage.getItem("savedPlayers"));

})();
