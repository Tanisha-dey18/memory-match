// Run with: node --test
const test = require("node:test");
const assert = require("node:assert");
const { shuffle, createGame, flip, hideMismatch, isWon } = require("./game.js");

// Finds the ids of two cards with the same symbol, or two different ones
function pairIds(game) {
  const first = game.cards[0];
  return [first.id, game.cards.find((c) => c.id !== first.id && c.symbol === first.symbol).id];
}
function mismatchIds(game) {
  const first = game.cards[0];
  return [first.id, game.cards.find((c) => c.symbol !== first.symbol).id];
}

test("shuffle keeps every item exactly once", () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8];
  assert.deepStrictEqual([...shuffle(items)].sort(), items);
});

test("a game has two of each symbol", () => {
  const game = createGame(8);
  assert.strictEqual(game.cards.length, 16);
  const counts = {};
  game.cards.forEach((c) => (counts[c.symbol] = (counts[c.symbol] || 0) + 1));
  assert.strictEqual(Object.keys(counts).length, 8);
  assert.ok(Object.values(counts).every((n) => n === 2));
});

test("flipping a matching pair marks both cards and counts one move", () => {
  const game = createGame(6);
  const [a, b] = pairIds(game);
  assert.strictEqual(flip(game, a), "flipped");
  assert.strictEqual(flip(game, b), "match");
  assert.ok(game.cards[a].matched && game.cards[b].matched);
  assert.deepStrictEqual([game.moves, game.matches, game.flipped.length], [1, 1, 0]);
});

test("a mismatch keeps both cards up until hidden, and blocks a third flip", () => {
  const game = createGame(6);
  const [a, b] = mismatchIds(game);
  flip(game, a);
  assert.strictEqual(flip(game, b), "mismatch");
  const third = game.cards.find((c) => c.id !== a && c.id !== b).id;
  assert.strictEqual(flip(game, third), "ignored");
  hideMismatch(game);
  assert.deepStrictEqual(game.flipped, []);
  assert.strictEqual(game.moves, 1);
});

test("flipping the same card twice or a matched card is ignored", () => {
  const game = createGame(6);
  const [a, b] = pairIds(game);
  flip(game, a);
  assert.strictEqual(flip(game, a), "ignored");
  flip(game, b);
  assert.strictEqual(flip(game, a), "ignored");
});

test("matching every pair wins the game", () => {
  const game = createGame(6);
  const done = new Set();
  for (const card of game.cards) {
    if (done.has(card.symbol)) continue;
    const [a, b] = game.cards.filter((c) => c.symbol === card.symbol).map((c) => c.id);
    flip(game, a);
    flip(game, b);
    done.add(card.symbol);
  }
  assert.ok(isWon(game));
  assert.strictEqual(game.moves, 6);
});
