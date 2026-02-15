const board = document.getElementById("board");
const turnInfoEl = document.getElementById("turnInfo");
const playersListEl = document.getElementById("playersList");
const winnersListEl = document.getElementById("winnersList");

// =============================
// SETTINGS
// =============================
const TRACK_SIZE = 103;
const HOME_PATH = 6;
const TOKENS_PER_PLAYER = 4;
const PLAYER_COUNT = 8;

const playerColors = [
  "red", "orange", "cyan", "brown",
  "blue", "lime", "yellow", "purple"
];

// =============================
// SOUND SYSTEM
// =============================
const sounds = {
  dice: new Audio("sounds/dice.mp3"),
  move: new Audio("sounds/move.mp3"),
  capture: new Audio("sounds/capture.wav"),
  music: new Audio("sounds/music.mp3")
};

sounds.music.loop = true;
sounds.music.volume = 0.4;

sounds.dice.volume = 0.9;
sounds.move.volume = 0.8;
sounds.capture.volume = 0.9;

let musicEnabled = localStorage.getItem("ludo8_music") === "true";

// prevent autoplay (only start after user click)
let musicUnlocked = false;

function playSound(name) {
  try {
    if (!sounds[name]) return;
    sounds[name].currentTime = 0;
    sounds[name].play();
  } catch (e) {}
}

function startMusic() {
  if (!musicUnlocked) return;
  if (!musicEnabled) return;

  try {
    sounds.music.play();
  } catch (e) {}
}

function stopMusic() {
  try {
    sounds.music.pause();
    sounds.music.currentTime = 0;
  } catch (e) {}
}

// =============================
// MUSIC BUTTON UI
// =============================
let musicBtn = document.getElementById("musicBtn");

if (!musicBtn) {
  musicBtn = document.createElement("button");
  musicBtn.id = "musicBtn";
  musicBtn.className = "musicBtn";
  document.body.appendChild(musicBtn);
}

function updateMusicButton() {
  if (musicEnabled) {
    musicBtn.innerHTML = "🔊 Music ON";
    musicBtn.style.borderColor = "#00ff88";
  } else {
    musicBtn.innerHTML = "🔇 Music OFF";
    musicBtn.style.borderColor = "#ff4444";
  }
}

musicBtn.addEventListener("click", () => {
  musicUnlocked = true;

  musicEnabled = !musicEnabled;
  localStorage.setItem("ludo8_music", musicEnabled);

  updateMusicButton();

  if (musicEnabled) {
    startMusic();
  } else {
    stopMusic();
  }
});

updateMusicButton();

// unlock music after first touch anywhere
document.addEventListener("click", () => {
  if (!musicUnlocked) {
    musicUnlocked = true;
    if (musicEnabled) startMusic();
  }
}, { once: true });

// =============================
// BOARD TRACK CELLS (YOUR DATA)
// =============================
const trackCells = [
  {"x":17.93,"y":42.66},{"x":22.45,"y":43.56},{"x":26.25,"y":43.38},{"x":30.4,"y":43.56},
  {"x":34.38,"y":43.38},{"x":36.91,"y":38.14},{"x":34.38,"y":35.97},{"x":31.85,"y":33.08},
  {"x":29.5,"y":30.37},{"x":26.61,"y":28.02},{"x":24.26,"y":25.31},{"x":26.79,"y":23.14},
  {"x":29.14,"y":20.97},{"x":31.85,"y":22.96},{"x":34.02,"y":25.49},{"x":36.37,"y":27.84},
  {"x":39.44,"y":30.37},{"x":42.52,"y":32.9},{"x":46.49,"y":31.81},{"x":47.04,"y":28.2},
  {"x":46.67,"y":24.22},{"x":46.49,"y":20.61},{"x":46.85,"y":16.99},{"x":47.04,"y":13.56},
  {"x":49.57,"y":13.92},{"x":53,"y":13.56},{"x":53,"y":17.72},{"x":53,"y":21.51},
  {"x":53.36,"y":23.14},{"x":53,"y":27.48},{"x":52.64,"y":32.54},{"x":56.44,"y":33.62},
  {"x":59.69,"y":30.91},{"x":62.58,"y":27.66},{"x":65.47,"y":25.31},{"x":67.46,"y":22.96},
  {"x":69.81,"y":20.61},{"x":72.7,"y":22.23},{"x":75.23,"y":25.13},{"x":73.43,"y":27.66},
  {"x":70.72,"y":31.27},{"x":68.73,"y":32.54},{"x":64.93,"y":35.61},{"x":62.04,"y":38.86},
  {"x":64.03,"y":42.66},{"x":68.55,"y":42.84},{"x":72.34,"y":42.84},{"x":76.5,"y":43.75},
  {"x":80.66,"y":43.56},{"x":84.27,"y":43.75},{"x":84.45,"y":46.46},{"x":85.18,"y":49.71},
  {"x":81.38,"y":49.71},{"x":77.4,"y":49.35},{"x":72.52,"y":49.71},{"x":68.73,"y":50.07},
  {"x":64.21,"y":49.89},{"x":62.58,"y":55.5},{"x":66.2,"y":57.3},{"x":68.19,"y":60.38},
  {"x":71.44,"y":62.73},{"x":73.43,"y":65.8},{"x":75.96,"y":67.43},{"x":72.52,"y":70.1},
  {"x":70.9,"y":72.99},{"x":67.64,"y":70.1},{"x":64.57,"y":67.57},{"x":62.58,"y":65.04},
  {"x":59.33,"y":62.87},{"x":57.16,"y":60.7},{"x":53.36,"y":62.15},{"x":52.82,"y":66.85},
  {"x":53.36,"y":69.92},{"x":53.18,"y":73.36},{"x":53.18,"y":77.87},{"x":52.82,"y":80.77},
  {"x":49.93,"y":80.22},{"x":47.04,"y":80.95},{"x":46.67,"y":77.33},{"x":46.85,"y":73.17},
  {"x":46.67,"y":70.28},{"x":46.49,"y":66.67},{"x":46.31,"y":61.97},{"x":42.15,"y":59.98},
  {"x":39.99,"y":63.59},{"x":36.55,"y":65.76},{"x":34.56,"y":68.29},{"x":31.85,"y":70.46},
  {"x":28.96,"y":72.99},{"x":26.25,"y":69.74},{"x":23.72,"y":68.11},{"x":26.43,"y":65.22},
  {"x":28.42,"y":62.87},{"x":31.31,"y":60.7},{"x":34.74,"y":57.45},{"x":37.27,"y":54.92},
  {"x":35.1,"y":50.58},{"x":31.31,"y":50.4},{"x":26.97,"y":50.22},{"x":22.27,"y":50.22},
  {"x":17.57,"y":50.04},{"x":15.22,"y":50.04},{"x":14.86,"y":46.24}
];

const homeCells = [
  [{"x":17.93,"y":46.46},{"x":22.27,"y":46.64},{"x":26.43,"y":47},{"x":30.22,"y":47.36},{"x":33.66,"y":47.18},{"x":39.44,"y":46.28}],
  [{"x":30.4,"y":24.62},{"x":31.85,"y":27.69},{"x":34.38,"y":30.22},{"x":36.91,"y":33.3},{"x":39.99,"y":36.37},{"x":43.06,"y":39.26}],
  [{"x":49.57,"y":16.31},{"x":49.75,"y":20.46},{"x":49.75,"y":24.08},{"x":49.75,"y":28.24},{"x":50.11,"y":31.67},{"x":50.11,"y":36.37}],
  [{"x":70.17,"y":25.89},{"x":68,"y":27.87},{"x":65.65,"y":31.13},{"x":62.94,"y":33.12},{"x":59.87,"y":36.19},{"x":56.62,"y":39.44}],
  [{"x":81.02,"y":46.31},{"x":76.5,"y":46.85},{"x":73.07,"y":46.67},{"x":68.73,"y":46.31},{"x":64.21,"y":47.4},{"x":59.87,"y":46.67}],
  [{"x":70.9,"y":68.11},{"x":68,"y":65.22},{"x":65.29,"y":62.33},{"x":62.76,"y":59.8},{"x":60.41,"y":57.45},{"x":56.25,"y":52.93}],
  [{"x":49.57,"y":77.15},{"x":49.57,"y":72.63},{"x":50.47,"y":69.02},{"x":50.11,"y":66.31},{"x":50.11,"y":62.51},{"x":50.47,"y":56.72}],
  [{"x":28.78,"y":68.33},{"x":31.13,"y":66.16},{"x":34.56,"y":62.18},{"x":36.55,"y":60.74},{"x":39.44,"y":58.03},{"x":42.34,"y":54.05}]
];

// =============================
// YOUR EXPORTED VALUES
// =============================
let diceBoxPositions = [
  { "x": 6.67, "y": 47.04 },
  { "x": 21.09, "y": 17.22 },
  { "x": 49.57, "y": 6.19 },
  { "x": 78.31, "y": 16.72 },
  { "x": 92.82, "y": 46.46 },
  { "x": 78.49, "y": 76.02 },
  { "x": 49.57, "y": 88.59 },
  { "x": 20.87, "y": 76.05 }
];

let diceBoxStyle = [
  { "width": 42, "height": 42, "rotate": 0 },
  { "width": 42, "height": 42, "rotate": 40 },
  { "width": 36, "height": 36, "rotate": 0 },
  { "width": 42, "height": 42, "rotate": 45 },
  { "width": 42, "height": 42, "rotate": 0 },
  { "width": 42, "height": 42, "rotate": 45 },
  { "width": 42, "height": 42, "rotate": 0 },
  { "width": 42, "height": 42, "rotate": 45 }
];

let panelLayout = {
  playersWidth: 43.5,
  winnersWidth: 54.5
};

let homeTokenSpots = [
  [
    { "x": 21.78886206355059, "y": 37.856980064100206 },
    { "x": 23.380301986912034, "y": 33.34790028124278 },
    { "x": 24.971741910273476, "y": 36.53078012796567 },
    { "x": 28.419861744223272, "y": 38.38746003855402 }
  ],
  [
    { "x": 37.70326129716503, "y": 20.08590091989741 },
    { "x": 41.68186110556864, "y": 18.759700983762873 },
    { "x": 40.62090115666101, "y": 22.20782081771267 },
    { "x": 42.47758106724936, "y": 25.655940651662462 }
  ],
  [
    { "x": 59.18770026254453, "y": 18.759700983762873 },
    { "x": 62.90106008372123, "y": 20.616380894351224 },
    { "x": 59.71818023699834, "y": 22.738738300792166484 },
    { "x": 58.657220288090706, "y": 25.921180638889375 }
  ],
  [
    { "x": 77.48925938120114, "y": 33.613140268469685 },
    { "x": 79.08069930456257, "y": 37.5917400768733 },
    { "x": 75.63257947061278, "y": 36.53078012796567 },
    { "x": 72.98017959834371, "y": 38.12222005132711 }
  ],
  [
    { "x": 79.34593929178948, "y": 56.954259144437536 },
    { "x": 77.75449936842804, "y": 61.463338927294956 },
    { "x": 75.63257947061278, "y": 58.280459080572065 },
    { "x": 72.4496996238899, "y": 56.954259144437536 }
  ],
  [
    { "x": 63.96202003262885, "y": 74.72533828864033 },
    { "x": 59.45294024977144, "y": 76.31677821200176 },
    { "x": 60.779140185905966, "y": 73.15801106839473 },
    { "x": 59.45294024977144, "y": 70.24037120889875 }
  ],
  [
    { "x": 41.41662111834174, "y": 76.07565092789072 },
    { "x": 37.70326129716503, "y": 74.74945099175618 },
    { "x": 40.090421182207194, "y": 72.62753109394092 },
    { "x": 41.94710109279555, "y": 69.97513122167184 }
  ],
  [
    { "x": 23.64554197413894, "y": 61.4874516304108 },
    { "x": 21.523622076323683, "y": 56.978371847553376 },
    { "x": 24.70650192304657, "y": 58.30457178368792 },
    { "x": 28.419861744223272, "y": 57.243611834780296 }
  ]
];

// =============================
// START INDEXES
// =============================
const playerStart = [0, 13, 26, 39, 52, 65, 78, 91];

// safe squares
const safeCells = new Set([
  ...playerStart,
  9, 22, 35, 48, 61, 74, 87, 100
]);

// =============================
// GAME STATE
// =============================
let dice = null;
let currentPlayer = 0;
let isAnimating = false;
let extraTurn = false;

let winners = []; // store player indexes in order

const tokens = [];
const diceBoxes = [];

let playerNames = [];

// =============================
// LOAD / SAVE NAMES
// =============================
function loadNames() {
  const saved = localStorage.getItem("ludo8_names");
  if (saved) {
    playerNames = JSON.parse(saved);
  } else {
    playerNames = [];
    for (let i = 0; i < PLAYER_COUNT; i++) {
      playerNames.push("Player " + (i + 1));
    }
  }
}

function saveNames() {
  localStorage.setItem("ludo8_names", JSON.stringify(playerNames));
}

// =============================
// DICE DOTS
// =============================
function getDiceDotPattern(num) {
  const patterns = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };
  return patterns[num] || [];
}

function setDiceFace(box, value) {
  box.innerHTML = "";
  if (value === null) return;

  const face = document.createElement("div");
  face.className = "diceFace";

  const onDots = getDiceDotPattern(value);

  for (let i = 0; i < 9; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    if (onDots.includes(i)) dot.classList.add("on");
    face.appendChild(dot);
  }

  box.appendChild(face);
}

// =============================
// POSITION HELPERS
// =============================
function setTokenPosition(token, xPercent, yPercent) {
  token.div.style.left = `calc(${xPercent}% - 7px)`;
  token.div.style.top = `calc(${yPercent}% - 7px)`;
}

function getTokenTrackIndex(token) {
  if (token.locked) return null;
  if (token.finished) return null;
  if (token.stepsMoved >= TRACK_SIZE) return null;

  const start = playerStart[token.player];
  return (start + token.stepsMoved) % TRACK_SIZE;
}

// =============================
// STACK FIX (spread overlapping tokens)
// =============================
function applyStackOffsets() {
  const map = {};

  for (let p = 0; p < PLAYER_COUNT; p++) {
    for (let t of tokens[p]) {
      if (t.locked || t.finished) continue;

      const idx = getTokenTrackIndex(t);
      if (idx === null) continue;

      if (!map[idx]) map[idx] = [];
      map[idx].push(t);
    }
  }

  // reset transforms
  for (let p = 0; p < PLAYER_COUNT; p++) {
    for (let t of tokens[p]) {
      t.div.style.transform = "";
    }
  }

  // apply offsets for stacked tokens
  for (let idx in map) {
    const arr = map[idx];
    if (arr.length <= 1) continue;

    const radius = 9;

    for (let i = 0; i < arr.length; i++) {
      const angle = (i / arr.length) * Math.PI * 2;
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;

      arr[i].div.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  }
}

// =============================
// TOKEN POSITIONING
// =============================
function positionToken(token) {
  if (token.locked) {
    const spot = homeTokenSpots[token.player][token.tokenIndex];
    setTokenPosition(token, spot.x, spot.y);
    return;
  }

  if (token.finished) {
    setTokenPosition(token, 50, 50);
    return;
  }

  if (token.stepsMoved < TRACK_SIZE) {
    const start = playerStart[token.player];
    const idx = (start + token.stepsMoved) % TRACK_SIZE;
    const pos = trackCells[idx];
    setTokenPosition(token, pos.x, pos.y);
    return;
  }

  const homeIndex = token.stepsMoved - TRACK_SIZE;
  if (homeIndex >= 0 && homeIndex < HOME_PATH) {
    const pos = homeCells[token.player][homeIndex];
    setTokenPosition(token, pos.x, pos.y);
  }
}

// =============================
// INIT TOKENS
// =============================
function initTokens() {
  for (let p = 0; p < PLAYER_COUNT; p++) {
    tokens[p] = [];

    for (let t = 0; t < TOKENS_PER_PLAYER; t++) {
      const tokenDiv = document.createElement("div");
      tokenDiv.className = "token";
      tokenDiv.style.background = playerColors[p];

      const tokenObj = {
        player: p,
        tokenIndex: t,
        locked: true,
        stepsMoved: 0,
        finished: false,
        div: tokenDiv
      };

      tokenDiv.addEventListener("click", () => onTokenClick(tokenObj));

      tokens[p].push(tokenObj);
      board.appendChild(tokenDiv);

      positionToken(tokenObj);
    }
  }
}

// =============================
// PLAYER LIST UI
// =============================
function renderPlayersList() {
  playersListEl.innerHTML = "";

  for (let i = 0; i < PLAYER_COUNT; i++) {
    const row = document.createElement("div");
    row.className = "playerRow";

    if (i === currentPlayer) {
      row.classList.add("active");
      row.style.borderColor = playerColors[i];
      row.style.boxShadow = `0 0 10px ${playerColors[i]}`; // reduced glow
    }

    const dot = document.createElement("div");
    dot.className = "playerDot";
    dot.style.background = playerColors[i];

    const name = document.createElement("div");
    name.innerText = playerNames[i];

    name.style.flex = "1";

    name.addEventListener("click", () => {
      const newName = prompt("Enter player name:", playerNames[i]);
      if (newName !== null && newName.trim() !== "") {
        playerNames[i] = newName.trim();
        saveNames();
        renderPlayersList();
        updateTurnText();
        renderWinnersList();
      }
    });

    // finished label
    const status = document.createElement("div");
    status.style.fontSize = "14px";
    status.style.opacity = "0.8";

    if (winners.includes(i)) {
      const pos = winners.indexOf(i);
      if (pos === 0) status.innerText = "🥇";
      if (pos === 1) status.innerText = "🥈";
      if (pos === 2) status.innerText = "🥉";
      if (pos > 2) status.innerText = "✔";
    }

    row.appendChild(dot);
    row.appendChild(name);
    row.appendChild(status);

    playersListEl.appendChild(row);
  }
}

// =============================
// WINNERS UI
// =============================
function renderWinnersList() {
  winnersListEl.innerHTML = "";

  if (winners.length === 0) {
    winnersListEl.innerHTML = `<div style="opacity:0.7;">No winners yet</div>`;
    return;
  }

  for (let i = 0; i < winners.length && i < 3; i++) {
    const p = winners[i];
    const line = document.createElement("div");
    line.style.padding = "6px";
    line.style.marginBottom = "6px";
    line.style.borderRadius = "10px";
    line.style.background = "rgba(0,0,0,0.6)";
    line.style.color = "white";
    line.style.fontFamily = "cursive";

    let medal = "🏆";
    if (i === 0) medal = "🥇";
    if (i === 1) medal = "🥈";
    if (i === 2) medal = "🥉";

    line.innerText = `${medal} ${playerNames[p]}`;
    winnersListEl.appendChild(line);
  }
}

// =============================
// TURN TEXT
// =============================
function updateTurnText() {
  turnInfoEl.innerText = "Turn: " + playerNames[currentPlayer];
  turnInfoEl.style.color = playerColors[currentPlayer];
  turnInfoEl.style.textShadow = `0 0 8px ${playerColors[currentPlayer]}`; // reduced glow
}

// =============================
// HIGHLIGHT
// =============================
function clearHighlights() {
  for (let p = 0; p < PLAYER_COUNT; p++) {
    for (let t of tokens[p]) {
      t.div.classList.remove("highlight");
      t.div.style.boxShadow = "";
    }
  }
}

function canMoveToken(token) {
  if (token.finished) return false;
  if (dice === null) return false;

  if (token.locked) return dice === 6;

  if (token.stepsMoved + dice > TRACK_SIZE + HOME_PATH) return false;
  return true;
}

function highlightMovableTokens() {
  clearHighlights();
  if (dice === null) return;

  for (let token of tokens[currentPlayer]) {
    if (canMoveToken(token)) {
      token.div.classList.add("highlight");
      token.div.style.boxShadow = `0 0 12px ${playerColors[currentPlayer]}`; // reduced glow
    }
  }
}

// =============================
// DICE BOXES
// =============================
function applyDiceStyle(i) {
  const st = diceBoxStyle[i];
  diceBoxes[i].style.width = st.width + "px";
  diceBoxes[i].style.height = st.height + "px";
  diceBoxes[i].style.transform = `rotate(${st.rotate}deg)`;
}

function updateDiceBoxPositions() {
  for (let i = 0; i < PLAYER_COUNT; i++) {
    const st = diceBoxStyle[i];
    diceBoxes[i].style.left = `calc(${diceBoxPositions[i].x}% - ${st.width / 2}px)`;
    diceBoxes[i].style.top = `calc(${diceBoxPositions[i].y}% - ${st.height / 2}px)`;
    applyDiceStyle(i);
  }
}

function createDiceBoxes() {
  for (let i = 0; i < PLAYER_COUNT; i++) {
    const d = document.createElement("div");
    d.className = "diceBox";

    d.addEventListener("click", () => {
      if (isAnimating) return;
      if (i !== currentPlayer) return;
      if (dice !== null) return;
      if (winners.includes(i)) return;

      rollDice();
      highlightMovableTokens();

      if (!hasPossibleMove(currentPlayer)) {
        setTimeout(() => nextTurn(), 600);
      }
    });

    board.appendChild(d);
    diceBoxes.push(d);
  }

  updateDiceBoxPositions();
}

// =============================
// UPDATE DICE UI
// =============================
function updateDiceBoxes() {
  for (let i = 0; i < PLAYER_COUNT; i++) {
    diceBoxes[i].classList.remove("active");
    diceBoxes[i].style.borderColor = "#222";
    diceBoxes[i].style.boxShadow = "";
    setDiceFace(diceBoxes[i], null);
  }

  diceBoxes[currentPlayer].classList.add("active");
  diceBoxes[currentPlayer].style.borderColor = playerColors[currentPlayer];
  diceBoxes[currentPlayer].style.boxShadow = `0 0 12px ${playerColors[currentPlayer]}`; // reduced glow

  if (dice !== null) {
    setDiceFace(diceBoxes[currentPlayer], dice);
  }
}

// =============================
// GAME LOGIC
// =============================
function rollDice() {
  dice = Math.floor(Math.random() * 6) + 1;
  playSound("dice");
  updateDiceBoxes();
}

function hasPossibleMove(player) {
  for (let token of tokens[player]) {
    if (canMoveToken(token)) return true;
  }
  return false;
}

function isPlayerFinished(player) {
  return tokens[player].every(t => t.finished);
}

// skip finished players
function nextTurn() {
  dice = null;
  clearHighlights();
  extraTurn = false;

  let tries = 0;

  do {
    currentPlayer = (currentPlayer + 1) % PLAYER_COUNT;
    tries++;
    if (tries > 20) break;
  } while (winners.includes(currentPlayer));

  updateTurnText();
  renderPlayersList();
  updateDiceBoxes();
}

// =============================
// BLOCK RULE (2 TOKENS SAME CELL)
// =============================
function isBlockAtCell(index) {
  const countByPlayer = {};

  for (let p = 0; p < PLAYER_COUNT; p++) {
    for (let t of tokens[p]) {
      if (t.locked || t.finished) continue;
      if (t.stepsMoved >= TRACK_SIZE) continue;

      const idx = getTokenTrackIndex(t);
      if (idx === index) {
        countByPlayer[p] = (countByPlayer[p] || 0) + 1;
      }
    }
  }

  for (let p in countByPlayer) {
    if (countByPlayer[p] >= 2) return true;
  }

  return false;
}

// =============================
// CAPTURE
// =============================
function checkCapture(movedToken) {
  if (movedToken.stepsMoved >= TRACK_SIZE) return false;

  const movedIndex =
    (playerStart[movedToken.player] + movedToken.stepsMoved) % TRACK_SIZE;

  if (safeCells.has(movedIndex)) return false;

  let samePlayerCount = 0;
  for (let t of tokens[movedToken.player]) {
    if (t.locked || t.finished) continue;
    if (t.stepsMoved >= TRACK_SIZE) continue;

    const idx = getTokenTrackIndex(t);
    if (idx === movedIndex) samePlayerCount++;
  }

  if (samePlayerCount >= 2) return false;

  for (let p = 0; p < PLAYER_COUNT; p++) {
    if (p === movedToken.player) continue;

    let enemyCount = 0;
    for (let other of tokens[p]) {
      if (other.locked || other.finished) continue;
      if (other.stepsMoved >= TRACK_SIZE) continue;

      const otherIndex = getTokenTrackIndex(other);
      if (otherIndex === movedIndex) enemyCount++;
    }

    if (enemyCount >= 2) continue;

    for (let other of tokens[p]) {
      if (other.locked || other.finished) continue;
      if (other.stepsMoved >= TRACK_SIZE) continue;

      const otherIndex = getTokenTrackIndex(other);

      if (otherIndex === movedIndex) {
        other.locked = true;
        other.stepsMoved = 0;
        positionToken(other);
        applyStackOffsets();

        playSound("capture");
        return true;
      }
    }
  }

  return false;
}

// =============================
// MOVE ANIMATION
// =============================
async function animateMove(token, steps) {
  isAnimating = true;

  for (let i = 0; i < steps; i++) {
    token.stepsMoved++;
    positionToken(token);
    applyStackOffsets();

    playSound("move");

    await new Promise((resolve) => setTimeout(resolve, 170));
  }

  isAnimating = false;
}

// =============================
// TOKEN CLICK
// =============================
async function onTokenClick(token) {
  if (isAnimating) return;
  if (token.player !== currentPlayer) return;
  if (dice === null) return;
  if (!canMoveToken(token)) return;
  if (winners.includes(currentPlayer)) return;

  clearHighlights();

  if (token.locked) {
    if (dice !== 6) return;

    token.locked = false;
    token.stepsMoved = 0;
    positionToken(token);
    applyStackOffsets();

    dice = null;
    updateDiceBoxes();
    return;
  }

  const moveSteps = dice;
  dice = null;
  updateDiceBoxes();

  await animateMove(token, moveSteps);

  if (token.stepsMoved === TRACK_SIZE + HOME_PATH) {
    token.finished = true;
    token.div.style.opacity = "0.5";
  }

  if (isPlayerFinished(currentPlayer)) {
    if (!winners.includes(currentPlayer)) {
      winners.push(currentPlayer);
      renderWinnersList();
      renderPlayersList();
    }
  }

  const captured = checkCapture(token);
  if (captured) extraTurn = true;

  applyStackOffsets();

  if (moveSteps === 6 || extraTurn) {
    extraTurn = false;
    dice = null;
    updateDiceBoxes();
    highlightMovableTokens();
    return;
  }

  nextTurn();
}

// =============================
// START GAME
// =============================
loadNames();
createDiceBoxes();
initTokens();

updateTurnText();
renderPlayersList();
renderWinnersList();
updateDiceBoxes();

applyStackOffsets();

window.addEventListener("resize", () => {
  updateDiceBoxPositions();
  applyStackOffsets();
});
