const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score-points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById('next-duel')
    },
    playerSide: {
        player1: "playerVs",
        playerBox: document.querySelector("#playerVs"),
        computer: "computerVs",
        computerBox: document.querySelector("#computerVs"),
    }

};

// Caminho da imagem das cartas 
const pathCardImages = "./src/assets/icons/";

// Cartas e propriedades
const cardData = [
    {
        id: 0,
        name: "Blye Eyes White Dragon",
        type: "Paper",
        img: `${pathCardImages}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathCardImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        img: `${pathCardImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];

// Função que randomiza as cartas entregues
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

// Cria a carta do Player e adiciona a feature de não conseguir ver a carta do inimigo
async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSide.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectedCards(idCard);
        });
    }

    return cardImage;
}

// Ver atributos e imagem assim que o mouse passa
async function drawSelectedCards(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

// Remove as cartas
async function removeAllCardsImages() {
    let { computerBox, playerBox } = state.playerSide;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = state.playerSide.playerBox;
    imgElements = playerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

// Função setar cartas no campo
async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    ShowHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInfield(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInfield(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

// Botão que aparece no fim do duelo
async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

// Lógica de duelo
async function checkDuelResults(playerCardId, ComputerCardId) {
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.winOf.includes(ComputerCardId)) {
        duelResults = "Win";
        state.score.playerScore++;
    }

    if (playerCard.loseOf.includes(ComputerCardId)) {
        duelResults = "Lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

// Aducuiba 5 cartas na mão do player e do computador
async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

// Reset
async function resetDuel() {
    state.cardSprites.avatar.src = ""
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

// Audio Win e Lose
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try {
        audio.play();
    } catch { }

}

async function ShowHiddenCardFieldsImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

// Função que está sendo usada em setCardsField para esconder os detalhes quando a carta é clicada
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
};

// Função init
function init() {
    ShowHiddenCardFieldsImages(false);

    drawCards(5, state.playerSide.player1);
    drawCards(5, state.playerSide.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();