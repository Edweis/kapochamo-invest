export type Post = {
  id: number;
  url: string;
  title: string;
  published: { date: string; timezone: string };
};
