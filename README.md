# Port Killer 🔫

A beautiful, interactive Terminal User Interface (TUI) to identify and kill running processes on your ports.

![Port Killer Demo](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Q1.../giphy.gif)

## Features
- **Clean UI**: Beautiful gradient header and clear table layout.
- **Interactive**: Navigate with arrow keys, kill with Enter.
- **Safe**: Clearly shows Process Name, PID, and Port before you act.
- **Zero Config**: Automatically scans your TCP ports.

## How to use

### Option 1: Run via npx (Recommended)
If published to npm, you can run it instantly without installation:
```bash
npx port-killer
```

### Option 2: Global Installation
Install it permanently on your system:
```bash
npm install -g port-killer
```
Then run it anywhere:
```bash
port-killer
```

### Option 3: Run from Source
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Start the tool:
   ```bash
   npm start
   ```

## Development
Built with [Ink](https://github.com/vadimdemedes/ink), React, and TypeScript.

```bash
# Run in dev mode (watches for changes)
npm run dev
```

## License
MIT
