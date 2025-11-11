# Clarkson Bot 2

A React + TypeScript + Vite application for leaving tributes to Clarkson Bot.

## Features

- View and add tributes (candles, bows, money)
- Secure serverless architecture using Netlify Functions
- Data stored in GitHub Gist
- Modern, responsive UI

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + SCSS
- **Backend**: Netlify Serverless Functions
- **Database**: GitHub Gist (public JSON storage)
- **Deployment**: Netlify

## Local Development

### Prerequisites

- Node.js 18+ (recommended: v22.11.0 or higher)
- npm 10+

### Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

3. **View the app**
   Open `http://localhost:5173` in your browser

### Local Development Notes

**For most development** (reading tributes, UI work):

```bash
npm run dev
# Open http://localhost:5173
```

- ✅ Fast hot reload
- ✅ Reading tributes works
- ❌ Writing tributes won't work (needs serverless function)

**For testing write functionality**:

```bash
# 1. Create .env file with your GITHUB_TOKEN (see below)
# 2. Run Netlify dev
npm run dev:netlify
# Open http://localhost:8888
```

- ✅ Serverless functions work
- ✅ Can test adding tributes
- ⚠️ Note: The Netlify dev proxy may have routing issues, but the API endpoints work

**To test write functionality without local setup:**
Just deploy to Netlify and test there (recommended for initial setup)

### Setting Up Local Environment Variables

If you want to test write functionality locally:

1. Create a `.env` file in the project root:

   ```bash
   touch .env
   ```

2. Add your GitHub token:

   ```env
   GITHUB_TOKEN=ghp_your_github_token_here
   ```

3. **Important**: The `.env` file is gitignored and will never be committed. This token is only used locally.

4. Get a GitHub token:
   - Go to https://github.com/settings/tokens
   - "Generate new token (classic)"
   - Select only "gist" scope
   - Copy the token to your `.env` file

## Deployment to Netlify

### Step 1: Connect Your Repository

1. Push your code to GitHub/GitLab/Bitbucket
2. Log in to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Netlify will auto-detect the settings from `netlify.toml`

### Step 2: Configure Environment Variables

**IMPORTANT**: You must set up a GitHub Personal Access Token for write functionality.

1. **Create a GitHub Personal Access Token**:

   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name like "Netlify Clarkson Bot"
   - Select scopes: **Only check "gist"**
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Add to Netlify**:
   - In Netlify dashboard, go to: **Site Settings → Environment Variables**
   - Click "Add a variable"
   - Key: `GITHUB_TOKEN`
   - Value: `ghp_your_token_here` (paste your token)
   - Click "Create variable"

### Step 3: Deploy

- Netlify will automatically deploy on every push to your main branch
- The first deploy happens immediately after connecting

## Architecture

### Security Model

This app uses a **serverless function** to keep the GitHub token secure:

```
Browser (Client)                  Netlify Function (Server)           GitHub API
     │                                    │                                │
     ├─ Read tributes ───────────────────┼───────────────────────────────→│
     │  (public, no auth)                 │                                │
     │                                    │                                │
     ├─ Write tribute ───→ POST /api ────┤                                │
     │                    + {type,author} │                                │
     │                                    ├─ Validates input               │
     │                                    ├─ Uses GITHUB_TOKEN ────────────→│
     │                                    │                      (secure!) │
     │  ←─ Success ─────────────────────────────────────────────────────────┤
```

**Key Security Features**:

- ✅ GitHub token stored server-side only (Netlify environment variables)
- ✅ Token never exposed to browser/client
- ✅ Input validation on serverless function
- ✅ Public reads don't require authentication

### File Structure

```
clarksonbot2/
├── src/
│   ├── components/        # React components
│   ├── services/
│   │   └── gistService.ts # Client-side API calls
│   └── types/             # TypeScript types
├── netlify/
│   └── functions/
│       └── add-tribute.ts # Serverless function (handles writes)
├── netlify.toml           # Netlify configuration
└── package.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
