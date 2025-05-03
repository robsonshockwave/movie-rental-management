## Comandos

- Para criar uma migration usar o comando `npm run migration:generate -- -n NomeDaMigration`
- Para rodar as migations usar o comando `npm run migration:run`

## Locadora

- Cliente (client): [name, cpf, phone, email, address]
- Filme (movie): [name, quantity, genre, ISAN, author]
- Aluguel (hire): [client_id, movie_id, requested_date, delivery_date, return_date]

Um cliente pode alugar vários filmes
Um filme pode ser alugado por vários clientes caso possua quantidade
Um aluguel possui um cliente e um filme

## Usecase

[X] Cadastrar um usuário
[X] Cpf e email devem ser únicos
[X] Buscar um cliente por Cpf
[X] Retornar um cliente ou vazio

[X] Cadastrar um filme
[X] ISAN deve ser único
[X] Buscar um filme por ISAN ou nome
[X] Retornar um filme ou vazio

[X] Alugar um filme ao cliente
[X] A data de solicitação não deve ser maior que a data para entrega
[X] Um cliente pode ter mais de um filme alugado ao mesmo tempo
[X] Um cliente não pode ter mais de um filme alugado com o mesmo ISAN ao mesmo tempo
[X] Ao alugar um filme, será enviado um email automaticamente informando o nome do filme, nome do cliente, cpf, data de solicitação e a data para entrega

[X] Devolver o filme alugado com o valor de R$ 10,00
[X] Caso o cliente atrase, será gerada uma multa de R$ 5,00 por dia

[X] Mostrar todos os filmes alugados pendentes, com o nome do filme, nome do cliente, cpf, data de solicitação e data de retorno, Ordenado pela data de solicitação mais recente e com paginação

## Repositories

## clientRepository

[X] create(name, cpf, phone, email, address): Promise<IClient>;
[X] findByCpf(cpf): Promise<IClient | null>;
[X] findByEmail(email): Promise<IClient | null>;

## movieRepository

[X] create(name, genre, quantity, ISAN, author): Promise<IMovie>;
[X] findByISAN(ISAN): Promise<IMovie | []>;
[X] findByISANorName(value): Promise<IMovie | []>;

## hireRepository

[X] create(client_id, movie_id, requested_date, delivery_date): Promise<IHire>;
[X] thisMovieHiredByClient(client_id, movie_id): Promise<boolean>;
[X] getHireWithClientAndMovieById(id): Promise<IHireWithClientAndMovie>;
[X] getPendingHires(): Promise<IHireWithClientAndMovie[]>;
[X] returnMovie(hire_id, return_date): Promise<IHire>;
