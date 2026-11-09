// Game rules for Memory Match. No DOM code here, so it can be tested on its own.

const SYMBOLS = ["🍎", "🚀", "🎸", "🐙", "🌵", "🎲", "🦊", "⚽", "🍩", "🌈", "🐢", "🎈"];

// Fisher–Yates shuffle: every ordering is equally likely
function shuffle(items, random = Math.random) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createGame(pairs, random = Math.random) {
  const symbols = SYMBOLS.slice(0, pairs);
  const cards = shuffle([...symbols, ...symbols], random).map((symbol, id) => ({
    id,
    symbol,
    matched: false,
  }));
  return { cards, flipped: [], moves: 0, matches: 0 };
}

// Returns what happened: "ignored", "flipped", "match" or "mismatch".
// On a mismatch both cards stay in `flipped` until hideMismatch() is called,
// so the player gets a moment to see them.
function flip(game, id) {
  const card = game.cards[id];
  if (!card || card.matched || game.flipped.length === 2 || game.flipped.includes(id)) {
    return "ignored";
  }
  game.flipped.push(id);
  if (game.flipped.length === 1) return "flipped";

  game.moves++;
  const [a, b] = game.flipped.map((i) => game.cards[i]);
  if (a.symbol === b.symbol) {
    a.matched = b.matched = true;
    game.matches++;
    game.flipped = [];
    return "match";
  }
  return "mismatch";
}

function hideMismatch(game) {
  game.flipped = [];
}

function isWon(game) {
  return game.matches * 2 === game.cards.length;
}

// Lets Node load this file for testing; ignored in the browser
if (typeof module !== "undefined") module.exports = { shuffle, createGame, flip, hideMismatch, isWon, SYMBOLS };
