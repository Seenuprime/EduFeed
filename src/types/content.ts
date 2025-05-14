export type Topic = 'motivation' | 'history' | 'science' | 'space' | 'for_you' | 'technology' | 'nature' | 'health' | 'computer_science';

export interface Content {
  _id: string;
  title: string;
  content: string;
  topic: Topic;
  author: string;
  likes: number;
  saves: number;
} 