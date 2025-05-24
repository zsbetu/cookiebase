export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  userId: string;
  createdAt?: any;
}