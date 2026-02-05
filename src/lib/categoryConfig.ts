import categoriesData from '@/data/categories.json';

export interface CategoryConfig {
  emoji: string;
  label: string;
  tagClass: string;
  title: string;
  sheetName: string;
  range: string;
}

export const categoryConfigMap: Record<string, CategoryConfig> = categoriesData as Record<string, CategoryConfig>;
