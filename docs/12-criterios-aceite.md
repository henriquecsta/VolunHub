# Criterios de Aceite do VolunHub

## Funcionalidades essenciais
- Cadastro e login de voluntarios e organizacoes funcionam.
- Organizacoes podem cadastrar, editar e excluir projetos.
- Organizacoes selecionam categorias existentes ao cadastrar ou editar projetos.
- Voluntarios podem consultar projetos sem login.
- Voluntarios podem se inscrever em projetos.
- Organizacoes podem visualizar inscricoes de seus projetos.
- Voluntarios podem consultar seu historico de participacao.
- Organizacoes podem consultar historico por projeto.

## Seguranca e autenticacao
- Senhas sao armazenadas de forma criptografada.
- Rotas protegidas exigem JWT valido.
- Perfis de usuario diferenciam voluntarios e organizacoes.

## Banco de dados e persistencia
- Modelo de dados com entidades e relacionamentos definidos.
- ENUMs de status e tipo de participacao estao implementados.
- Categorias de projetos estao previamente cadastradas e persistidas corretamente.

## Busca e filtros
- Projeto pode ser buscado por cidade, estado e tipo de participacao.
- Filtros sao opcionais e nao quebram a busca.

## Documentacao e entrega
- Todos os documentos em `/docs` estao presentes.
- O projeto possui `.gitignore` apropriado.
- O repositorio Git esta inicializado e os commits sao granulares.
