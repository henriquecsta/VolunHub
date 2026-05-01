# Regras de Negocio do VolunHub

- Apenas organizacoes podem cadastrar projetos.
- Apenas organizacoes podem editar ou excluir projetos que criaram.
- Organizacoes devem selecionar apenas categorias previamente cadastradas no banco.
- Apenas voluntarios podem se inscrever em projetos.
- Um voluntario nao deve se inscrever duas vezes no mesmo projeto.
- Projetos sem vagas disponiveis nao devem aceitar novas inscricoes.
- Voluntarios devem poder consultar projetos disponiveis sem login.
- Organizacoes devem visualizar apenas inscricoes relacionadas aos seus projetos.
- Senhas devem ser armazenadas de forma criptografada.
- A autenticacao deve usar JWT para acesso a rotas protegidas.
- Projetos ATIVOS sao exibidos por padrao nas buscas.
- Inscricoes podem ter status PENDENTE, APROVADA, RECUSADA ou CANCELADA.
- Projetos tem status ATIVO, ENCERRADO ou CANCELADO.
- Projetos devem informar cidade, estado, local e tipo de participacao.
- O tipo de participacao do projeto deve ser PRESENCIAL, REMOTO ou HIBRIDO.
- O historico de participacao deve registrar a situacao e observacao de cada voluntario por projeto.
- O historico de participacao deve poder ser consultado por projeto.
- Filtros opcionais de busca nao devem quebrar a pesquisa de projetos.
