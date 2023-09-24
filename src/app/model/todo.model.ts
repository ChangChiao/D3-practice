export interface TodoState {
  todo: Todo[];
}

export interface Todo {
  userId: number;
  id: number;
  title: string;
  body: string;
}
