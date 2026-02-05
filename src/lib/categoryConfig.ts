export const categoryConfigMap: Record<string, { emoji: string; label: string; tagClass: string; title: string }> = {
  outstanding: {
    emoji: '⭐',
    label: 'Top Tier',
    tagClass: 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900',
    title: 'Outstanding Movies',
  },
  mediocre: {
    emoji: '😐',
    label: 'Mediocre',
    tagClass: 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900',
    title: 'Mediocre Movies',
  },
  shit: {
    emoji: '💩',
    label: 'Avoid',
    tagClass: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900',
    title: 'Shit Movies',
  },
  towatch: {
    emoji: '📺',
    label: 'To Watch',
    tagClass: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900',
    title: 'To Watch / Re-watch / Yet to be Categorized',
  },
};
