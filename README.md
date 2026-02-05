# 🎬 Movie Archive Dashboard

A personal movie archive dashboard that fetches data from Google Sheets and displays it in a beautiful, clean interface.

## Features

- 📊 Fetches movie data directly from Google Sheets
- 🎨 Clean, modern UI with Tailwind CSS
- ✨ Smooth animations with Framer Motion
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🚀 Built with Next.js 14 App Router
- ⚡ TypeScript for type safety

## Movie Categories

- **Outstanding** - Top-tier movies I'd recommend without hesitation
- **Mediocre** - Watchable but forgettable
- **Shit** - Movies to avoid
- **To Watch/Rewatch** - Movies on my radar

## Setup Instructions

### 1. Google Sheets Configuration

1. Create a Google Sheet with 4 tabs named exactly:
   - `Outstanding`
   - `Mediocre`
   - `Shit`
   - `To Watch`

2. Each tab should have these columns in row 1 (headers):
   - Name
   - Language
   - Year
   - Theme
   - Comment

3. Make your sheet **publicly viewable**:
   - Click "Share" button
   - Change access to "Anyone with the link can view"
   - Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### 2. Configure the App

1. Open `src/lib/sheets.ts`
2. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Google Sheet ID
3. If your sheet tab names are different, update the `SHEET_RANGES` object

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Deployment on Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy!

The app will rebuild when you trigger a deployment. To get fresh data from your Google Sheet, just redeploy or wait for the next build.

## Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router pages
│   ├── outstanding/       # Outstanding movies page
│   ├── mediocre/          # Mediocre movies page
│   ├── shit/              # Shit movies page
│   ├── towatch/           # To Watch page
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Homepage showing all categories
├── components/            # React components
│   ├── MovieCard.tsx      # Individual movie card
│   ├── MovieList.tsx      # List of movies
│   └── Navigation.tsx     # Navigation bar
├── lib/                   # Utilities
│   └── sheets.ts          # Google Sheets data fetching
└── types/                 # TypeScript types
    └── movie.ts           # Movie type definitions
\`\`\`

## Customization

### Colors & Styling
Edit `src/app/globals.css` or use Tailwind classes in components.

### Animations
Modify Framer Motion settings in `src/components/MovieCard.tsx` and `src/components/Navigation.tsx`.

### Sheet Structure
If you want different columns, update:
1. `Movie` interface in `src/types/movie.ts`
2. Parsing logic in `src/lib/sheets.ts`
3. Display in `src/components/MovieCard.tsx`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Data Source**: Google Sheets (Visualization API)
- **Deployment**: Vercel

## Notes

- The app fetches fresh data from Google Sheets on every page load (`revalidate: 0`)
- No authentication required - uses Google Visualization API
- Perfect for personal use and sharing with friends/family
- Data is cached during build in production

## License

This is a personal project. Feel free to use it as inspiration for your own!
