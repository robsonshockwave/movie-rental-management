export class Movie {
  constructor(
    public name: string,
    public genre: string,
    public quantity: number,
    public ISAN: string,
    public author: string
  ) {}
}

export type IMovie = Movie & {
  id: string;
};
