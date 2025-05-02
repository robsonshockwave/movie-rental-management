export class Hire {
  constructor(
    public client_id: string,
    public movie_id: string,
    public requested_date: string,
    public delivery_date: string
  ) {}
}

export type IHire = Hire & {
  id: string;
  return_date: string | null;
};
