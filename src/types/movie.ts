export interface Movie {
  name: string;
  language: string;
  year: string;
  theme: string;
  comment: string;
  commentLabel?: string;
  image?: string; // Optional image URL from sheet or TMDB
  tmdb?: TMDBMovieDetails; // Optional TMDB data for modal details
}

export interface TMDBVideo {
  id: string;
  key: string; // YouTube or Vimeo video ID
  name: string;
  site: string; // 'YouTube' or 'Vimeo'
  type: string; // 'Trailer', 'Teaser', 'Clip', 'Featurette', etc.
  official: boolean;
  publishedAt?: string;
}

export interface TMDBImage {
  filePath: string;
  aspectRatio: number;
  height: number;
  width: number;
  type: 'backdrop' | 'poster';
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  originalTitle?: string;
  overview: string;
  releaseDate?: string;
  runtime?: number;
  genres: string[];
  rating?: number;
  voteCount?: number;
  originalLanguage?: string;
  posterPath?: string;
  backdropPath?: string;
  tagline?: string;
  imdbId?: string; // IMDb ID for external link
  popularity?: number;
  videos?: TMDBVideo[];
  images?: TMDBImage[];
}

export type MovieCategory = 'outstanding' | 'mediocre' | 'shit' | 'towatch';

export interface MovieSheet {
  category: MovieCategory;
  title: string;
  movies: Movie[];
}
