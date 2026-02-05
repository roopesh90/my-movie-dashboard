#!/bin/bash

# Navigate to project directory
cd /Users/roopesh_personal/code/movie-dashboard

# Commit 1: Initial Next.js setup
git add .gitignore package.json next.config.ts tsconfig.json eslint.config.mjs postcss.config.mjs next-env.d.ts public/
git commit -m "feat: initial Next.js 14 setup with TypeScript and Tailwind CSS

- Configure Next.js 14 with App Router
- Add TypeScript configuration
- Set up Tailwind CSS v4
- Configure ESLint
- Add basic project structure"

# Commit 2: Add Framer Motion
git add package.json package-lock.json
git commit -m "feat: add Framer Motion for animations

- Install framer-motion package
- Update dependencies"

# Commit 3: TypeScript types
git add src/types/
git commit -m "feat: create TypeScript types for movie data

- Define Movie interface with all required fields
- Add MovieCategory type for category names
- Create MovieSheet interface for API responses"

# Commit 4: Google Sheets integration
git add src/lib/sheets.ts
git commit -m "feat: implement Google Sheets data fetching

- Add fetchMoviesFromSheet function using Google Visualization API
- Add fetchAllMovies to get all categories
- Configure sheet ranges for each category
- No authentication required approach"

# Commit 5: MovieCard component
git add src/components/MovieCard.tsx
git commit -m "feat: create MovieCard component

- Display movie details with clean card layout
- Add Framer Motion animations on mount
- Support dark mode styling
- Show movie metadata (name, language, year, theme, comment)"

# Commit 6: MovieList component
git add src/components/MovieList.tsx
git commit -m "feat: create MovieList component

- Grid layout for movie cards
- Responsive design (1-3 columns)
- Display movie count
- Handle empty state"

# Commit 7: Navigation component
git add src/components/Navigation.tsx
git commit -m "feat: create Navigation component

- Animated navigation bar with active tab indicator
- Desktop and mobile responsive layouts
- Category links with hover states
- Framer Motion layoutId for smooth transitions"

# Commit 8: Update layout
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: update root layout with navigation

- Integrate Navigation component
- Update metadata for movie archive
- Configure consistent page layout
- Add background styling"

# Commit 9: Homepage
git add src/app/page.tsx
git commit -m "feat: create homepage with all movie categories

- Fetch and display all categories
- Responsive grid layout
- Welcome message and description
- Disable caching for fresh data (revalidate: 0)"

# Commit 10: Category pages
git add src/app/outstanding/ src/app/mediocre/ src/app/shit/ src/app/towatch/
git commit -m "feat: create individual category pages

- Outstanding movies page with green badge
- Mediocre movies page with yellow badge
- Shit movies page with red badge  
- To Watch/Rewatch page with blue badge
- Each page fetches its own category data"

# Commit 11: Documentation
git add README.md .env.example
git commit -m "docs: comprehensive README and configuration

- Add complete setup instructions
- Document Google Sheets configuration
- Add deployment guide for Vercel
- Include project structure and tech stack
- Add customization tips
- Create .env.example template"

# Commit 12: Project configuration
git add .github/ copilot-instructions.md .vscode/
git commit -m "chore: add project configuration and tasks

- Add Copilot instructions for project context
- Create VS Code tasks for development
- Document build process"

echo "✅ All commits created successfully!"
git log --oneline
