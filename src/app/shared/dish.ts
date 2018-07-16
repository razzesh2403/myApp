import { Comment } from '../shared/comment';

export class Dish {
    name: string;
    image: string;
    category: string;
    label: string;
    price: string;
    description: string;
    comments : Comment[];
}