# The Last Stop — AI Murder Mystery

A web murder-mystery game where each suspect is an LLM-driven character that knows only its own truths, secrets and lies.

## Structure

```
docs/       Case design, roadmap, change lists
shared/     Types shared by client and server (@mystery/shared)
server/     Express + TypeScript API (@mystery/server)
  src/config/   Environment loading
  src/routes/   HTTP routes (mounted under /api)
  src/llm/      LLM wrapper (callModel)
  src/engine/   Prompt builder, consistency checker, world state
  src/data/     case.json
client/     Vite + React + TypeScript (@mystery/client)
  src/api/        Fetch helpers for /api
  src/components/ UI components
```

## Getting started

```bash
npm install
cp server/.env.example server/.env   # then fill in LLM_API_KEY / LLM_MODEL
npm run dev                          # server :3001, client :5173 (proxies /api)
```

## Scripts (run from the root)

| Script                            | What it does                                            |
| --------------------------------- | ------------------------------------------------------- |
| `npm run dev`                     | Server (tsx watch) and client (Vite) together           |
| `npm run build`                   | Bundle the server with tsup, build the client with Vite |
| `npm run typecheck`               | `tsc --noEmit` in every workspace                       |
| `npm run lint` / `lint:fix`       | ESLint                                                  |
| `npm run format` / `format:check` | Prettier                                                |
