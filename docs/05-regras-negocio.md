# Regras de Negócio do VolunHub

- Apenas organizações podem cadastrar projetos.
- Apenas organizações podem editar ou excluir projetos que criaram.
- Apenas voluntários podem se inscrever em projetos.
- Um voluntário não deve se inscrever duas vezes no mesmo projeto.
- Projetos sem vagas disponíveis não devem aceitar novas inscrições.
- Voluntários devem poder consultar projetos disponíveis sem login.
- Organizações devem visualizar apenas inscrições relacionadas aos seus projetos.
- Senhas devem ser armazenadas de forma criptografada.
- A autenticação deve usar JWT para acesso a rotas protegidas.
- Projetos ATIVOS são exibidos por padrão nas buscas.
- Inscrições podem ter status PENDENTE, APROVADA, RECUSADA ou CANCELADA.
- Projetos têm status ATIVO, ENCERRADO ou CANCELADO.
- O histórico de participação deve registrar a situação e observação de cada voluntário por projeto.
- Filtros opcionais de busca não devem quebrar a pesquisa de projetos.
