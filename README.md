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
- 🖼️ Movie poster images (from sheet or TMDB)
- 🎞️ Media carousel with trailers and stills (TMDB videos + images)
- ⚡ 10-day browser caching for movie images
- 🧹 Built-in cache management tools

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
   - Image (optional - paste image URL here)

3. Make your sheet **publicly viewable**:
   - Click "Share" button
   - Change access to "Anyone with the link can view"
   - Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### 2. Configure the App
Create a `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   ```
   NEXT_PUBLIC_SHEET_ID=your_actual_sheet_id
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_bearer_token
   NEXT_PUBLIC_SITE_OWNER=Your Name
   ```

3. If your sheet tab names are different, update them in `src/data/categories.json`

### 3. TMDB Media (Optional)

**Option A: Manual Images (Recommended)**
- Add image URLs directly in the "Image" column (F) of your Google Sheet
- You can get movie poster URLs from:
  - Google Images (copy image URL)
  - TMDB: https://www.themoviedb.org/movie/[id]
  - IMDb, or any other source

**Option B: Auto-fetch from TMDB**
- Sign up for free at https://www.themoviedb.org/settings/api
- Use the **API Read Access Token** (Bearer token), not the v3 API key
- Add your token to `.env`: `NEXT_PUBLIC_TMDB_API_KEY=your_bearer_token`
- Leave the Image column empty and the app will auto-fetch posters
- The app searches by movie name, language, and year for better accuracy

**Option C: Hybrid (Best of Both)**
- Add URLs manually where you want specific images
- Leave blank for others and TMDB will auto-fill them
- Get the best of both approaches!


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

## Performance & Caching

### Browser Image Caching

Movie poster images are automatically cached in your browser for **10 days** to improve performance:

- **First load**: Images downloaded from TMDB
- **Subsequent loads**: Images served from browser cache
- **After 10 days**: Cache expires and fresh images are fetched
- **No storage limits**: Uses standard browser caching, not localStorage

### Clearing Cache

If you need to refresh cached images (e.g., if TMDB updates posters):

1. Click the **⚙️ Cache** button in the navigation bar
2. Choose one of these options:
   - **Clear Image Cache**: Removes only cached movie posters
   - **Clear All Cache**: Removes all application cache and resets the app
3. The page will automatically refresh after clearing

### Manual Cache Management

You can also clear cache programmatically:

```typescript
import { clearImageCache, clearApplicationCache } from '@/lib/cache';

// Clear only image cache
await clearImageCache();

// Clear everything
await clearApplicationCache();
```

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
- **Movie Images**: TMDB API (optional)
- **Deployment**: Vercel

## Attribution

This project uses **The Movie Database (TMDB) API** for fetching movie poster images and data.

### Required TMDB Attribution

> **This product uses the TMDB API but is not endorsed or certified by TMDB.**

TMDB's terms of use require proper attribution whenever their data or images are used. This project includes:

✅ **Attribution Footer**: Displays on every page with links to TMDB  
✅ **Image Attribution**: Hover tooltip on movie posters showing "Image from TMDB"  
✅ **Clear Disclaimers**: Legal disclaimer that the app is not endorsed by TMDB  
✅ **Link to Guidelines**: Direct link to TMDB's official attribution guidelines  

### TMDB Brand Guidelines

When deploying or modifying this app, follow [TMDB's official attribution guidelines](https://www.themoviedb.org/about/logos-attribution):

- Always credit TMDB as the data source
- Use official TMDB logos if available (get them from the link above)
- Don't imply endorsement by TMDB
- Respect their rate limits and API terms
- Include appropriate disclaimers

### If You Deploy This App

1. Ensure the Attribution footer remains visible
2. Download TMDB logos from their [logos & attribution page](https://www.themoviedb.org/about/logos-attribution)
3. Consider adding the TMDB logo to your deployment
4. Follow their brand guidelines for logo placement and spacing

### API Terms

- **Personal Use**: Free tier is perfect for personal projects
- **Rate Limits**: Respect TMDB's API rate limits (typically 40 requests/10 seconds)
- **Commercial Use**: Contact TMDB for commercial licensing
- **Attribution**: Always required, regardless of use case

## Notes

- The app fetches fresh data from Google Sheets on every page load (`revalidate: 0`)
- TMDB enrichment is optional and uses Bearer token auth
- Language codes are converted to readable names in the UI
- Perfect for personal use and sharing with friends/family
- Includes proper TMDB attribution footer

## License

This is a personal project. Feel free to use it as inspiration for your own!
