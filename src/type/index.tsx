import exp from "constants";

export type Blog = {
  id: number;
  title: string;
  user_id: number;
  body: string;
}

export type Comment = {
  id: number;
  post_id: number;
  name: string;
  body: string;
  email: string;
}
export type User = {
  id: number;
  email: string;
  name: string;
  gender: string;
  status: string;
}