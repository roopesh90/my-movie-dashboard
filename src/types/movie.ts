export interface Movie {
  name: string;
  language: string;
  year: string;
  theme: string;
  comment: string;
  image?: string; // Optional image URL from sheet or TMDB
}

export type MovieCategory = 'outstanding' | 'mediocre' | 'shit' | 'towatch';

export interface MovieSheet {
  category: MovieCategory;
  title: string;
  movies: Movie[];
}
