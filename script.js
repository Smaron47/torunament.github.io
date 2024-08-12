// // Initialize history stack and current round players
// let historyStack = [];
// let currentRoundPlayers = [];

// // Function to shuffle the array of players
// function shuffleArray(inputArray) {
//   let currentIndex = inputArray.length,
//     temporaryValue,
//     randomIndex;
//   while (0 !== currentIndex) {
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;
//     temporaryValue = inputArray[currentIndex];
//     inputArray[currentIndex] = inputArray[randomIndex];
//     inputArray[randomIndex] = temporaryValue;
//   }
//   return inputArray;
// }

// // Function to create a player button
// function createButton(text, onClick, isBye = false) {
//   const button = document.createElement("button");
//   button.textContent = text;
//   button.className = "team";
//   if (isBye) {
//     button.classList.add("bye");
//     button.disabled = true;
//   } else {
//     button.addEventListener("click", onClick);
//   }
//   return button;
// }

// // Function to generate the bracket
// function generateBracket() {
//   const optionSection = document.getElementById("options");
//   const numberInput = document.getElementById("numberOfPlayers");
//   const playerNumber = parseInt(numberInput.value);

//   // Function to display a warning message
//   function displayWarning(condition, messageString, messageId, warningObject) {
//     if (!condition) {
//       if (!document.getElementById(messageId)) {
//         const warning = document.createElement("p");
//         warning.setAttribute("id", messageId);
//         warning.className = "warningMessage";
//         warning.textContent = messageString;
//         optionSection.insertBefore(warning, warningObject);
//       }
//       throw new Error(messageString);
//     } else {
//       const warning = document.getElementById(messageId);
//       if (warning) {
//         optionSection.removeChild(warning);
//       }
//     }
//   }

//   // Validate the number of players
//   displayWarning(
//     playerNumber >= 2,
//     "Please enter a valid number of players (at least 2)",
//     "playerCountWarning",
//     numberInput
//   );

//   const nameBox = document.getElementById("names");
//   let names = nameBox.value
//   .split("\n")
//   .map((name) =>
//     name
//       .replace(/\b(Random! |random|Random|roll|a|rolls)\b/gi, "")
//       .replace(/\./g, "") // Remove all periods
//       .trim()
//   )
//   .filter((name) => name);

//   // Validate the number of player names
//   displayWarning(
//     names.length === playerNumber,
//     "Please enter the same number of players as submitted in step 1",
//     "numberOfPlayersWarning",
//     nameBox
//   );

//   const bracketBox = document.getElementById("bracket");
//   bracketBox.innerHTML = ""; // Clear previous bracket without removing game data

//   // Shuffle the players for unordered play
//   const shuffledNames = shuffleArray(names);

//   // Calculate the number of byes needed
//   const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(playerNumber)));
//   const numberOfByes = nextPowerOfTwo - playerNumber;

//   // Create initial match array with byes
//   let matchArray = new Array(nextPowerOfTwo).fill(null);
//   let currentNameIndex = 0;
//   for (let i = 0; i < nextPowerOfTwo; i++) {
//     if (currentNameIndex < playerNumber) {
//       matchArray[i] = shuffledNames[currentNameIndex];
//       currentNameIndex++;
//     } else {
//       matchArray[i] = "Bye";
//     }
//   }

//   // Function to check for consecutive byes and reshuffle
//   function ensureNoConsecutiveByes(array) {
//     for (let i = 0; i < array.length - 1; i += 2) {
//       if (array[i] === "Bye" && array[i + 1] === "Bye") {
//         shuffleArray(array);
//         i = -2; // Restart check if a pair is found
//       }
//     }
//     return array;
//   }

//   // Reshuffle until no consecutive byes
//   matchArray = ensureNoConsecutiveByes(matchArray);

//   currentRoundPlayers = matchArray; // Save the initial round players
//   createNextRound(currentRoundPlayers, 1);
// }

// function createNextRound(players, roundNumber) {
//   const bracketBox = document.getElementById("bracket");

//   // Create a new row for the round header
//   const roundHeaderRow = document.createElement("div");
//   roundHeaderRow.className = "round-header-row";

//   // Add round header
//   const roundHeader = document.createElement("h3");
//   roundHeader.className = "round-header";
//   roundHeader.textContent = `Round ${roundNumber}`;
//   roundHeaderRow.appendChild(roundHeader);
//   bracketBox.appendChild(roundHeaderRow);

//   // Create a new row for matches
//   const column = document.createElement("div");
//   column.className = "column";

//   const nextRoundPlayers = [];

//   for (let i = 0; i < players.length; i += 2) {
//     const match = document.createElement("div");
//     match.className = "match";

//     const onClickPlayer1 = () => selectWinner(i, players[i]);
//     const onClickPlayer2 = () => selectWinner(i + 1, players[i + 1]);

//     const team1 = createButton(players[i], onClickPlayer1, players[i] === "Bye");
//     const team2 = createButton(players[i + 1], onClickPlayer2, players[i + 1] === "Bye");

//     const matchTop = document.createElement("div");
//     matchTop.className = "match-top";
//     matchTop.appendChild(team1);

//     const matchBottom = document.createElement("div");
//     matchBottom.className = "match-bottom";
//     matchBottom.appendChild(team2);

//     match.appendChild(matchTop);
//     match.appendChild(matchBottom);

//     column.appendChild(match);

//     if (players[i] !== "Bye" && players[i + 1] === "Bye") {
//       nextRoundPlayers.push(players[i]);
//     } else if (players[i + 1] !== "Bye" && players[i] === "Bye") {
//       nextRoundPlayers.push(players[i + 1]);
//     }
//   }

//   bracketBox.appendChild(column);

//   function selectWinner(index, winner) {
//     if (winner !== "Bye") {
//       const matchIndex = Math.floor(index / 2);
//       const match = column.children[matchIndex];

//       // Reset previously selected winner
//       for (let button of match.querySelectorAll(".team")) {
//         button.classList.remove("selected");
//       }

//       const selectedButton = match.querySelectorAll(".team")[index % 2];
//       selectedButton.classList.add("selected");

//       if (!nextRoundPlayers.includes(winner)) {
//         nextRoundPlayers.push(winner);
//       }

//       if (nextRoundPlayers.length === players.length / 2) {
//         currentRoundPlayers = nextRoundPlayers;
//         historyStack.push(() => {
//           // Restore the previous state
//           currentRoundPlayers.pop();
//           refreshBracket(roundNumber);
//         });
//         if (nextRoundPlayers.length > 1) {
//           createNextRound(currentRoundPlayers, roundNumber + 1);
//         } else {
//           displayWinner(nextRoundPlayers[0]);
//         }
//       }
//     }
//   }

//   if (players.length === 1) {
//     displayWinner(players[0]);
//   }
// }


// // Function to display the winner
// function displayWinner(winner) {
//   const bracketBox = document.getElementById("bracket");
//   const winnerDiv = document.createElement("div");
//   winnerDiv.className = "winner";
//   winnerDiv.textContent = `Winner: ${winner}`;
//   bracketBox.appendChild(winnerDiv);
// }

// // Function to undo the last action
// function undoLastAction() {
//   if (historyStack.length > 0) {
//     const lastAction = historyStack.pop();
//     console(historyStack)
//     lastAction();
//     refreshBracket(); // Refresh the display to reflect the undo action
//   }
// }

// // Function to refresh the bracket display
// function refreshBracket(roundNumber) {
//   const bracketBox = document.getElementById("bracket");
//   bracketBox.innerHTML = ""; // Clear current bracket
//   createNextRound(currentRoundPlayers, roundNumber);
// }

// // Function to take a screenshot of the bracket
// function takeScreenshot() {
//   const bracketBox = document.getElementById("bracket");
//   html2canvas(bracketBox)
//     .then((canvas) => {
//       const link = document.createElement("a");
//       link.href = canvas.toDataURL("image/jpeg");
//       link.download = "tournament-bracket.jpg";
//       link.click();
//     })
//     .catch((error) => {
//       console.error("Screenshot capture failed:", error);
//     });
// }



// Initialize history stack and current round players
let historyStack = [];
let currentRoundPlayers = [];
let roundNumber = 1; // Track the current round number

// Function to shuffle the array of players
function shuffleArray(inputArray) {
  let currentIndex = inputArray.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = inputArray[currentIndex];
    inputArray[currentIndex] = inputArray[randomIndex];
    inputArray[randomIndex] = temporaryValue;
  }
  return inputArray;
}

// Function to create a player button
function createButton(text, onClick, isBye = false) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = "team";
  if (isBye) {
    button.classList.add("bye");
    button.disabled = true;
  } else {
    button.addEventListener("click", onClick);
  }
  return button;
}

// Function to generate the bracket
function generateBracket() {
  const optionSection = document.getElementById("options");
  const numberInput = document.getElementById("numberOfPlayers");
  const playerNumber = parseInt(numberInput.value);

  // Function to display a warning message
  function displayWarning(condition, messageString, messageId, warningObject) {
    if (!condition) {
      if (!document.getElementById(messageId)) {
        const warning = document.createElement("p");
        warning.setAttribute("id", messageId);
        warning.className = "warningMessage";
        warning.textContent = messageString;
        optionSection.insertBefore(warning, warningObject);
      }
      throw new Error(messageString);
    } else {
      const warning = document.getElementById(messageId);
      if (warning) {
        optionSection.removeChild(warning);
      }
    }
  }

  // Validate the number of players
  displayWarning(
    playerNumber >= 2,
    "Please enter a valid number of players (at least 2)",
    "playerCountWarning",
    numberInput
  );

  const nameBox = document.getElementById("names");
  let names = nameBox.value
    .split("\n")
    .map((name) =>
      name
        .replace(/\b(Random! |random|Random|roll|a|rolls)\b/gi, "")
        .replace(/\./g, "") // Remove all periods
        .trim()
    )
    .filter((name) => name);

  // Validate the number of player names
  displayWarning(
    names.length === playerNumber,
    "Please enter the same number of players as submitted in step 1",
    "numberOfPlayersWarning",
    nameBox
  );

  const bracketBox = document.getElementById("bracket");
  bracketBox.innerHTML = ""; // Clear previous bracket

  // Shuffle the players for unordered play
  const shuffledNames = shuffleArray(names);

  // Calculate the number of byes needed
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(playerNumber)));
  const numberOfByes = nextPowerOfTwo - playerNumber;

  // Create initial match array with byes
  let matchArray = new Array(nextPowerOfTwo).fill(null);
  let currentNameIndex = 0;
  for (let i = 0; i < nextPowerOfTwo; i++) {
    if (currentNameIndex < playerNumber) {
      matchArray[i] = shuffledNames[currentNameIndex];
      currentNameIndex++;
    } else {
      matchArray[i] = "Bye";
    }
  }

  // Function to check for consecutive byes and reshuffle
  function ensureNoConsecutiveByes(array) {
    for (let i = 0; i < array.length - 1; i += 2) {
      if (array[i] === "Bye" && array[i + 1] === "Bye") {
        shuffleArray(array);
        i = -2; // Restart check if a pair is found
      }
    }
    return array;
  }

  // Reshuffle until no consecutive byes
  matchArray = ensureNoConsecutiveByes(matchArray);

  currentRoundPlayers = matchArray; // Save the initial round players
  roundNumber = 1; // Reset round number to 1
  historyStack = [currentRoundPlayers]; // Initialize history stack with the first round
  createNextRound(currentRoundPlayers, roundNumber);
}

function createNextRound(players, roundNumber) {
  const bracketBox = document.getElementById("bracket");

  // Create a new row for the round header
  const roundHeaderRow = document.createElement("div");
  roundHeaderRow.className = "round-header-row";

  // Add round header
  const roundHeader = document.createElement("h3");
  roundHeader.className = "round-header";
  roundHeader.textContent = `Round ${roundNumber}`;
  roundHeaderRow.appendChild(roundHeader);
  bracketBox.appendChild(roundHeaderRow);

  // Create a new row for matches
  const column = document.createElement("div");
  column.className = "column";

  const nextRoundPlayers = [];

  for (let i = 0; i < players.length; i += 2) {
    const match = document.createElement("div");
    match.className = "match";

    const onClickPlayer1 = () => selectWinner(i, players[i]);
    const onClickPlayer2 = () => selectWinner(i + 1, players[i + 1]);

    const team1 = createButton(players[i], onClickPlayer1, players[i] === "Bye");
    const team2 = createButton(players[i + 1], onClickPlayer2, players[i + 1] === "Bye");

    const matchTop = document.createElement("div");
    matchTop.className = "match-top";
    matchTop.appendChild(team1);

    const matchBottom = document.createElement("div");
    matchBottom.className = "match-bottom";
    matchBottom.appendChild(team2);

    match.appendChild(matchTop);
    match.appendChild(matchBottom);

    column.appendChild(match);

    if (players[i] !== "Bye" && players[i + 1] === "Bye") {
      nextRoundPlayers.push(players[i]);
    } else if (players[i + 1] !== "Bye" && players[i] === "Bye") {
      nextRoundPlayers.push(players[i + 1]);
    }
  }

  bracketBox.appendChild(column);

  function selectWinner(index, winner) {
    if (winner !== "Bye") {
      const matchIndex = Math.floor(index / 2);
      const match = column.children[matchIndex];

      // Reset previously selected winner
      for (let button of match.querySelectorAll(".team")) {
        button.classList.remove("selected");
      }

      const selectedButton = match.querySelectorAll(".team")[index % 2];
      selectedButton.classList.add("selected");

      if (!nextRoundPlayers.includes(winner)) {
        nextRoundPlayers.push(winner);
      }

      if (nextRoundPlayers.length === players.length / 2) {
        currentRoundPlayers = nextRoundPlayers;
        historyStack = historyStack.slice(0, roundNumber); // Trim history stack to current round
        roundNumber++;
        historyStack.push(nextRoundPlayers); // Save the state of the next round
        createNextRound(currentRoundPlayers, roundNumber);
      }
    }
  }

  if (players.length === 1) {
    displayWinner(players[0]);
  }
}

// Function to display the winner
function displayWinner(winner) {
  const bracketBox = document.getElementById("bracket");
  const winnerDiv = document.createElement("div");
  winnerDiv.className = "winner";
  winnerDiv.textContent = `Winner: ${winner}`;
  bracketBox.appendChild(winnerDiv);
}

// Function to undo the last action
function undoLastAction() {
  if (historyStack.length > 1) {
    historyStack.pop(); // Remove the state of the current round
    roundNumber--;
    currentRoundPlayers = historyStack[historyStack.length - 1] || []; // Get the previous round's players
    refreshBracket();
  } else {
    alert("It's round 1; can't undo.");
  }
}

// Function to refresh the bracket display
function refreshBracket() {
  const bracketBox = document.getElementById("bracket");
  bracketBox.innerHTML = ""; // Clear current bracket
  let tempRoundNumber = 1;
  for (let i = 0; i < historyStack.length; i++) {
    createNextRound(historyStack[i], tempRoundNumber);
    tempRoundNumber++;
  }
}


function takeScreenshot() {
  const bracketBox = document.getElementById("bracket");

  // Temporarily expand the div to its full content size
  const originalStyles = {
    width: bracketBox.style.width,
    height: bracketBox.style.height,
    overflow: bracketBox.style.overflow,
    position: bracketBox.style.position,
    top: bracketBox.style.top,
    left: bracketBox.style.left
  };

  // Set the styles to capture the full content
  bracketBox.style.width = 'auto';
  bracketBox.style.height = 'auto';
  bracketBox.style.overflow = 'visible';
  bracketBox.style.position = 'absolute';
  bracketBox.style.top = '0';
  bracketBox.style.left = '0';

  html2canvas(bracketBox)
    .then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg");
      link.download = "tournament-bracket.jpg";
      link.click();

      // Restore original styles
      bracketBox.style.width = originalStyles.width;
      bracketBox.style.height = originalStyles.height;
      bracketBox.style.overflow = originalStyles.overflow;
      bracketBox.style.position = originalStyles.position;
      bracketBox.style.top = originalStyles.top;
      bracketBox.style.left = originalStyles.left;
    })
    .catch((error) => {
      console.error("Screenshot capture failed:", error);

      // Restore original styles if there's an error
      bracketBox.style.width = originalStyles.width;
      bracketBox.style.height = originalStyles.height;
      bracketBox.style.overflow = originalStyles.overflow;
      bracketBox.style.position = originalStyles.position;
      bracketBox.style.top = originalStyles.top;
      bracketBox.style.left = originalStyles.left;
    });
}