const MISMATCH_DELAY_MS = 800;

const boardEl = document.getElementById("board");
const sizeEl = document.getElementById("size");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");
const messageEl = document.getElementById("message");

let game, cardEls, startedAt, clock, hideTimer;

function bestKey() {
  return `memory-match-best-${sizeEl.value}`;
}

function loadBest() {
  try { return JSON.parse(localStorage.getItem(bestKey())); } catch { return null; }
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function newGame() {
  clearInterval(clock);
  clearTimeout(hideTimer);
  clock = null;
  startedAt = null;
  game = createGame(Number(sizeEl.value));

  boardEl.classList.toggle("wide", game.cards.length > 16);
  boardEl.innerHTML = "";
  cardEls = game.cards.map((card) => {
    const el = document.createElement("button");
    el.className = "card";
    el.innerHTML = '<div class="inner"><div class="back"></div><div class="face"></div></div>';
    el.querySelector(".face").textContent = card.symbol;
    el.onclick = () => onFlip(card.id);
    boardEl.append(el);
    return el;
  });

  messageEl.textContent = "";
  timeEl.textContent = "0:00";
  const best = loadBest();
  bestEl.textContent = best ? `${best.moves} moves` : "–";
  render();
}

function onFlip(id) {
  // Start the clock on the first flip, not when the page loads
  if (!startedAt) {
    startedAt = Date.now();
    clock = setInterval(() => (timeEl.textContent = formatTime(Date.now() - startedAt)), 250);
  }

  const result = flip(game, id);
  if (result === "mismatch") {
    hideTimer = setTimeout(() => {
      hideMismatch(game);
      render();
    }, MISMATCH_DELAY_MS);
  }
  render();
  if (result === "match" && isWon(game)) win();
}

function win() {
  clearInterval(clock);
  const time = Date.now() - startedAt;
  timeEl.textContent = formatTime(time);

  const best = loadBest();
  const isBest = !best || game.moves < best.moves || (game.moves === best.moves && time < best.time);
  if (isBest) {
    try { localStorage.setItem(bestKey(), JSON.stringify({ moves: game.moves, time })); } catch {}
    bestEl.textContent = `${game.moves} moves`;
  }
  messageEl.textContent = `Solved in ${game.moves} moves and ${formatTime(time)}!` + (isBest ? " 🏆 New best!" : "");
}

function render() {
  movesEl.textContent = game.moves;
  game.cards.forEach((card, i) => {
    const up = card.matched || game.flipped.includes(card.id);
    cardEls[i].classList.toggle("up", up);
    cardEls[i].classList.toggle("matched", card.matched);
    cardEls[i].setAttribute("aria-label", up ? card.symbol : "Hidden card");
  });
}

document.getElementById("restart").onclick = newGame;
sizeEl.onchange = newGame;

newGame();
