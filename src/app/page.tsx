import { fetchAllMovies } from '@/lib/sheets';
import MovieList from '@/components/MovieList';
import { categoryConfigMap } from '@/lib/categoryConfig';

const SITE_OWNER = process.env.NEXT_PUBLIC_SITE_OWNER || 'My';

export const revalidate = 300; // ISR: Revalidate every 5 minutes

export default async function Home() {
  const movieSheets = await fetchAllMovies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🎬 {SITE_OWNER}&apos;s Movie Archive
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A personal collection of movies I&apos;ve watched and loved (or not).
          Browse by category to see what I recommend.
        </p>
      </div>

      <div className="space-y-16">
        {movieSheets.map((sheet) => {
          const config = categoryConfigMap[sheet.category];
          return (
            <section key={sheet.category} id={sheet.category}>
              <MovieList
                movies={sheet.movies}
                title={config?.title ?? sheet.title}
                category={config}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
