var bj = (function() {
  var cardNums;
  var deck;
  var dealerScore;
  var playerScore;
  var dealerHand;
  var playerHand;
  var gameOver;
  var savedPlayers = [{
    currentPlayer: "Test1",
    savedWins: 5
  }];
  var success = false;
  var wins = 0;
  var playerIndex;

  function savePlayerData() {
    let playerName = window.prompt("What's your name?");

    let asdf = savedPlayers.find(x => x.currentPlayer === playerName);
    success = asdf === undefined ? false : true;
    if (!success) {
      savedPlayers.push({
        currentPlayer: playerName,
        savedWins: 0
      });
      localStorage.setItem("savedPlayers", JSON.stringify(savedPlayers));
      playerIndex = savedPlayers.length - 1;
      window.alert("Hello " + playerName + ", welcome to Blackjack! You are a new player and you have not won any games yet. In this simulation of Blackjack, the green box displays the gameplay, the red box displays the moves you can make, and the blue box displays your current hand. Enjoy!");
    } else {
      playerIndex = savedPlayers.indexOf(asdf);
      wins = savedPlayers[playerIndex].savedWins;
      window.alert("Hello " + playerName + ", welcome back to Blackjack! You are a returning player and you have won " + wins + " game(s).");
    }
  }

  function randomCard(deck) {
    var index = Math.floor(Math.random() * deck.length);
    var newCard = deck[index];
    deck.splice(index, 1);
    return newCard;
  }

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
    } else {
      gameOver = false;
    }
  }

  function moveHit() {
    playerHand.push(randomCard(deck));

    let gameList = document.getElementById('gameInfo');
    let next = document.createElement('li');
    next.appendChild(document.createTextNode("You took a hit. Your cards are now " + playerHand + "."));
    gameList.appendChild(next);

    showCards();
    updateScore();
  }

  function dealerTurn() {
    if (dealerScore < 17) {
      let gameList = document.getElementById('gameInfo');
      let next = document.createElement('li');
      next.appendChild(document.createTextNode("The dealer took a hit."));
      gameList.appendChild(next);

      dealerHand.push(randomCard(deck));
      updateScore();
      return true;
    } else {
      if (!gameOver) {
        let gameList = document.getElementById('gameInfo');
        let next = document.createElement('li');
        next.appendChild(document.createTextNode("The dealer took a stand."));
        gameList.appendChild(next);
      }
      return false;
    }
  }

  function moveStand() {
    if (!gameOver) {
      let gameList = document.getElementById('gameInfo');
      let next = document.createElement('li');
      next.appendChild(document.createTextNode("You took a stand"));
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
    deal();
    updateScore();
  }

  window.onload = function() {
    savedPlayers = localStorage.getItem("savedPlayers");
    savedPlayers = savedPlayers ? JSON.parse(savedPlayers) : [];

    savePlayerData();
    initGame();
  }

  return {
    "moveHit": moveHit,
    "moveStand": moveStand
  };
  //localStorage.clear();
  //document.write(localStorage.getItem("savedPlayers"));
})();
