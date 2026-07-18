// Entry point for cPanel's Passenger-based Node.js App, which requires a plain JS file that
// starts listening itself (it can't invoke package.json scripts like `npm start` directly).
// Local/Docker development still uses `npm run dev` / `npm run start` as documented in the README.
const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Ready on port ${port}`);
  });
});
