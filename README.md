# ElectroCalc XP

ElectroCalc XP is a small browser-based toolbox for electronics calculations,
wrapped in a Windows XP-inspired interface.

The project started as a quick experiment: build a useful electronics utility
with AI assistance, make it easy to access, and avoid any installation step
beyond opening it in a browser.

The public instance is at <https://ecxp.nglab.net>.

## Tools

- AVR fuse and lock bit calculator
- Resistor color code calculator
- E-series value browser
- Voltage divider calculator

## Running Locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

Run tests with:

```bash
npm test
```

## Docker

The Docker image builds the app in a Node.js stage and serves the generated
static files with the static `static-web-server` image.

```bash
docker build -t ecxp .
docker run --rm -p 8080:80 ecxp
```

Then open <http://localhost:8080>.

## Tech

- React
- TypeScript
- Vite
- Zustand
- xp.css

## License

MIT. See [LICENSE](./LICENSE).
