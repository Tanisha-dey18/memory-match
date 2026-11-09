# 🃏 Memory Match

A card-matching memory game in the browser: flip two cards at a time and find all the pairs in as few moves as possible. No dependencies, no build step.

## Features

- Three board sizes: 12, 16 or 24 cards
- 3D card-flip animation (turned off if your system prefers reduced motion)
- Move counter and timer that starts on your first flip
- Best score per board size, saved in your browser
- Keyboard friendly: cards are buttons, so Tab and Enter work

## Project structure

| File           | Purpose                                        |
|----------------|------------------------------------------------|
| `index.html`   | Page layout                                    |
| `style.css`    | Styling and the card-flip animation            |
| `game.js`      | Game rules (no DOM, testable in Node)          |
| `script.js`    | UI: board, timer, best score                   |
| `game.test.js` | Tests for the rules                            |

## How it works

- **Shuffling** uses the Fisher–Yates algorithm, which makes every ordering equally likely. The common `sort(() => Math.random() - 0.5)` trick is biased.
- **Game state** is a plain object: `{ cards, flipped, moves, matches }`. `flip(game, id)` returns what happened (`"flipped"`, `"match"`, `"mismatch"` or `"ignored"`), and the UI reacts to that.
- **Mismatches** stay face up for 0.8 s. A third card can't be flipped meanwhile.
- **The flip animation** is pure CSS: each card has a back and a face stacked on top of each other with `backface-visibility: hidden`. Adding the `up` class rotates the card 180° in 3D.

## Run it

Open `index.html` in a browser, or serve it locally:

```bash
python -m http.server 8000
```

## Run the tests

Requires Node.js 18+:

```bash
node --test
```

## License

[MIT](LICENSE)
