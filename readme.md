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

[] Cadastrar um filme
[] ISAN deve ser único
[] Buscar um filme por ISAN ou nome
[] Retornar um filme ou vazio

[] Alugar um filme ao cliente
[] A data de solicitação não deve ser maior que a data para entrega
[] Um cliente pode ter mais de um filme alugado ao mesmo tempo
[] Um cliente não pode ter mais de um filme alugado com o mesmo ISAN ao mesmo tempo
[] Ao alugar um filme, será enviado um email automaticamente informando o nome do filme, nome do cliente, cpf, data de solicitação e a data para entrega

[] Devolver o filme alugado com o valor de R$ 10,00
[] Caso o cliente atrase, será gerada uma multa de R$ 5,00 por dia

[] Mostrar todos os filmes alugados pendentes, com o nome do filme, nome do cliente, cpf, data de solicitação e data de retorno, Ordenado pela data de solicitação mais recente e com paginação
