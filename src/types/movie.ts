export interface Movie {
  name: string;
  language: string;
  year: string;
  theme: string;
  comment: string;
}

export type MovieCategory = 'outstanding' | 'mediocre' | 'shit' | 'towatch';

export interface MovieSheet {
  category: MovieCategory;
  title: string;
  movies: Movie[];
}
