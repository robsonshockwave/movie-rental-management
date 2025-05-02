import { IClient } from './Client';
import { IMovie } from './Movie';

export class Hire {
  constructor(
    public client_id: string,
    public movie_id: string,
    public requested_date: string,
    public delivery_date: string,
    public return_date: string | null = null
  ) {}
}

export type IHire = Hire & {
  id: string;
  client: IClient;
  movie: IMovie;
};
