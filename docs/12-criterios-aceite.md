# Critérios de Aceite do VolunHub

## Funcionalidades essenciais
- Cadastro e login de voluntários e organizações funcionam.
- Organizações podem cadastrar, editar e excluir projetos.
- Voluntários podem consultar projetos sem login.
- Voluntários podem se inscrever em projetos.
- Organizações podem visualizar inscrições de seus projetos.
- Voluntários podem consultar seu histórico de participação.

## Segurança e autenticação
- Senhas são armazenadas de forma criptografada.
- Rotas protegidas exigem JWT válido.
- Perfis de usuário diferenciam voluntários e organizações.

## Banco de dados e persistência
- Modelo de dados com entidades e relacionamentos definidos.
- ENUMs de status implementados para projetos e inscrições.
- Categorias de projetos são persistidas corretamente.

## Busca e filtros
- Projeto pode ser buscado com filtros básicos.
- Filtros são opcionais e não quebram a busca.

## Documentação e entrega
- Todos os documentos em `/docs` estão presentes.
- O projeto possui `.gitignore` apropriado.
- O repositório Git está inicializado e os commits são granulares.
