var bj = (function() {
  var sessId;
  var currentUn = "";
  var currentPw = "";

  function savePlayerData(loggedIn) {
    let currentPlayer = document.getElementById("username").value;
    let currentPassword = document.getElementById("password").value;

    fetch('http://52.54.181.235:3000/api/login?username=' + currentPlayer + '&password=' + currentPassword + '&loggedIn=' + loggedIn).then(function(response) {
      response.json().then(function(data) {
        if (data.statement !== ""){
          currentUn = data.user;
          currentPw = data.pass;

          let gameList = document.getElementById('gameInfo');
          let next = document.createElement('li');
          next.appendChild(document.createTextNode("Hello " + data.user + "! " + data.statement));
          gameList.appendChild(next);

          sessId = data.sessId;
          document.getElementById('sessionId').innerHTML = "Session ID: " + data.sessId;

          updatePlayers();
          initGame();
        }
        else {
          let gameList = document.getElementById('gameInfo');
          let next = document.createElement('li');
          next.appendChild(document.createTextNode("Hello " + data.user + "! Your password is invalid. Refresh the page and try again."));
          gameList.appendChild(next);
        }
      })
    });
  }

  function showCards(playerHand) {
    for (var i = 0; i < playerHand.length; i++) {
      let cardNums = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
      let cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

      let rank = playerHand[i].slice(0, playerHand[i].indexOf(" "));
      let suit = playerHand[i].slice(playerHand[i].lastIndexOf(" ") + 1, playerHand[i].lastIndexOf(" ") + 2);
      let cardId = rank.toLowerCase() + suit;

      if (!document.getElementById(cardId)) {
        let color = suit === "C" || "S" ? "black" : "red";
        let cardName = cardValues[cardNums.indexOf(rank)];
        let symbol = suit === "C" ? "♣" : suit === "S" ? "♠" : suit === "D" ? "♦" : "♥";

        let divDeck = document.getElementById("deck");
        let divCard = document.createElement("div");
        divCard.setAttribute("id", cardId);
        divCard.setAttribute("target", color);
        divCard.setAttribute("class", "currentCards");
        divCard.appendChild(document.createTextNode(cardName + symbol));
        divDeck.appendChild(divCard);
      }
    }
  }

  function updatePlayers() {
    fetch('http://52.54.181.235:3000/api/updatePlayers').then(function(response) {
      response.json().then(function(data) {
        for (var i = 0; i < data.listOfPlayers.length; i++) {
          let list = document.getElementById('playerList');
          let next = document.createElement('li');
          next.appendChild(document.createTextNode("User: " + data.listOfPlayers[i] + " - Won: " + data.listOfWins[i] + " - Lost: " + data.listOfLosses[i]));
          list.appendChild(next);
        }
      })
    });
  }

  function disableButtons() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
  }

  function moveHit() {
    fetch('http://52.54.181.235:3000/api/hit?sessId=' + sessId + '&username=' + currentUn).then(function(response) {
      response.json().then(function(data) {
        showCards(data.playerHand);

        let gameList = document.getElementById('gameInfo');
        let next = document.createElement('li');
        next.appendChild(document.createTextNode("You took a hit. Your cards are now " + JSON.stringify(data.playerHand) + ". Your score is " + data.playerScore + "."));
        gameList.appendChild(next);

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
    fetch('http://52.54.181.235:3000/api/stand?sessId=' + sessId + '&username=' + currentUn).then(function(response) {
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
    fetch('http://52.54.181.235:3000/api/init?sessId=' + sessId + '&username=' + currentUn).then(function(response) {
      response.json().then(function(data) {
        showCards(data.playerHand);

        let gameList = document.getElementById('gameInfo');
        let next = document.createElement('li');
        next.appendChild(document.createTextNode("Your cards are " + JSON.stringify(data.playerHand) + ". Your score is " + data.playerScore + "."));
        gameList.appendChild(next);

        if (data.gameOver) {
          let gameList1 = document.getElementById('gameInfo');
          let next1 = document.createElement('li');
          next1.appendChild(document.createTextNode(data.gameState));
          gameList1.appendChild(next1);

          disableButtons();
        }
      })
    });
  }

  function playGame(loggedIn) {
    savePlayerData(loggedIn);
    document.getElementById('submit').disabled = true;
    document.getElementById('username').disabled = true;
    document.getElementById('password').disabled = true;
  }

  window.onload = function() {
    let submit = document.getElementById('submit');
    submit.onclick = function() {
      playGame(false);
    };

    let playAgain = document.getElementById('playAgain');
    playAgain.onclick = function() {
      let gameList = document.getElementById('gameInfo');
      let next = document.createElement('li');
      next.appendChild(document.createTextNode("--------------------------- NEW GAME ---------------------------"));
      gameList.appendChild(next);

      document.getElementById("username").value = currentUn;
      document.getElementById("password").value = currentPw;

      document.getElementById("hit").disabled = false;
      document.getElementById("stand").disabled = false;

      var currentDeck = document.getElementById("deck");
      while (currentDeck.firstChild) {
        currentDeck.removeChild(currentDeck.firstChild);
      }
      let divDeck = document.getElementById("deck");
      let cardHeader = document.createElement('p');
      cardHeader.setAttribute("value", "Your Cards:");
      divDeck.appendChild(cardHeader);

      playGame(true);
    };
  }

  return {
    "moveHit": moveHit,
    "moveStand": moveStand
  };
})();
