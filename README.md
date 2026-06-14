# VolunHub

VolunHub e uma aplicacao web para conectar voluntarios a organizacoes sociais. O projeto possui backend Spring Boot, frontend React/Vite e banco relacional MySQL/MariaDB executado fora do repositorio.

## URLs de producao

- Frontend: `https://volun-hub.vercel.app`
- Backend/API: `https://volunhub-production.up.railway.app`

Em producao, o backend roda no Railway, o banco MySQL tambem fica no Railway e o frontend roda na Vercel. Localmente, essas configuracoes nao impedem o uso normal do projeto: quando variaveis de ambiente nao sao definidas, a aplicacao usa os valores padrao do arquivo `application.properties` e do frontend.

## Requisitos

- Java 21.
- Maven 3.9 ou superior.
- Node.js 18 ou superior.
- NPM.
- MariaDB ou MySQL instalado na maquina para execucao local.
- Git opcional, para clonar o repositorio.

O projeto nao possui `mvnw.cmd`. Se o Maven Wrapper nao for adicionado futuramente, instale o Maven globalmente e confirme com:

```bash
mvn -v
```

## Execucao local apos o deploy

As configuracoes de deploy foram preparadas para usar variaveis de ambiente em producao, mas continuam preservando a execucao local.

Sem variaveis de ambiente definidas, o backend usa:

- Porta local: `8080`.
- Banco: `localhost:3306`.
- Database: `volunhub`.
- Usuario: `root`.
- Senha padrao: valor definido em `backend/src/main/resources/application.properties`.
- DDL do Hibernate: `update`.
- Dialect padrao: `org.hibernate.dialect.MySQLDialect`.

A configuracao de porta para deploy deve seguir o padrao `server.port=${PORT:8080}`: no Railway a plataforma fornece `PORT`; localmente, sem essa variavel, a aplicacao continua em `8080`.

O frontend, sem `VITE_API_URL`, chama:

```text
http://localhost:8080
```

Em producao, Railway e Vercel devem fornecer as variaveis de ambiente necessarias. O backend deve aceitar a origem publica do frontend via `FRONTEND_URL`, e o frontend deve apontar para a API publica via `VITE_API_URL`.

## Variaveis de ambiente

### Backend

| Variavel | Producao | Local | Descricao |
| --- | --- | --- | --- |
| `PORT` | Obrigatoria no Railway ou injetada pela plataforma | Opcional | Porta HTTP do backend. Com default local, usa `8080`. |
| `MYSQL_URL` | Obrigatoria | Opcional | URL JDBC do banco. Localmente usa `jdbc:mysql://localhost:3306/volunhub?...`. |
| `MYSQL_USERNAME` | Obrigatoria | Opcional | Usuario do banco. Localmente usa `root`. |
| `MYSQL_PASSWORD` | Obrigatoria | Opcional | Senha do banco. Localmente usa o valor padrao do `application.properties`. |
| `JWT_SECRET` | Obrigatoria | Opcional | Chave usada para assinar tokens JWT. Em producao, use um segredo forte. |
| `JWT_EXPIRATION_MS` | Opcional | Opcional | Tempo de expiracao do JWT em milissegundos. Default: `86400000`. |
| `FRONTEND_URL` | Obrigatoria | Opcional | Origem permitida no CORS. Em producao: `https://volun-hub.vercel.app`. Pode aceitar mais de uma URL separada por virgula. |
| `HIBERNATE_DIALECT` | Opcional | Opcional | Dialect do Hibernate. Default: `org.hibernate.dialect.MySQLDialect`. Sobrescreva apenas se necessario. |
| `JPA_DDL_AUTO` | Opcional | Opcional | Estrategia de schema do Hibernate. Default: `update`. |

### Frontend

| Variavel | Producao | Local | Descricao |
| --- | --- | --- | --- |
| `VITE_API_URL` | Obrigatoria | Opcional | URL base da API. Em producao: `https://volunhub-production.up.railway.app`. Localmente usa `http://localhost:8080`. |

## Instalacao do banco local

O banco nao deve ficar dentro da pasta do projeto. Instale o MariaDB ou MySQL normalmente no sistema operacional e mantenha o servico ativo antes de iniciar o backend.

1. Instale o MariaDB ou MySQL pelo instalador oficial ou pelo gerenciador de pacotes do seu sistema.
2. Confirme que o servico esta rodando na porta padrao `3306`.
3. Acesse o console do banco:

```bash
mysql -u root -p
```

ou, em instalacoes MariaDB:

```bash
mariadb -u root -p
```

4. Crie o banco do projeto:

```sql
CREATE DATABASE volunhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Opcionalmente, crie um usuario especifico para a aplicacao:

```sql
CREATE USER 'volunhub'@'localhost' IDENTIFIED BY 'volunhub123';
GRANT ALL PRIVILEGES ON volunhub.* TO 'volunhub'@'localhost';
FLUSH PRIVILEGES;
```

6. Se usar esse usuario, configure as variaveis no terminal antes de iniciar o backend:

```powershell
$env:MYSQL_USERNAME="volunhub"
$env:MYSQL_PASSWORD="volunhub123"
```

## Backend local

Entre na pasta do backend:

```bash
cd backend
```

Garanta que o MariaDB/MySQL esta rodando, que o banco `volunhub` existe e que o `application.properties` aponta para a configuracao local desejada.

Execute:

```bash
mvn spring-boot:run
```

Para gerar o pacote:

```bash
mvn clean package
```

O backend local fica disponivel em:

```text
http://localhost:8080
```

## Frontend local

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependencias:

```bash
npm.cmd install
```

Execute em desenvolvimento:

```bash
npm.cmd run dev
```

O Vite normalmente abre em:

```text
http://localhost:5173
```

Para gerar build de producao:

```bash
npm.cmd run build
```

Para validar o build localmente:

```bash
npm.cmd run preview
```

Se o PowerShell bloquear `npm` por politica de execucao de scripts, use `npm.cmd`, como nos comandos acima.

## Primeira execucao local

1. Inicie o MariaDB ou MySQL.
2. Crie o banco `volunhub`.
3. Confirme as credenciais em `backend/src/main/resources/application.properties` ou configure variaveis de ambiente.
4. Inicie o backend com `mvn spring-boot:run`.
5. Inicie o frontend com `npm.cmd run dev`.
6. Acesse `http://localhost:5173`.

## Deploy em producao

### Railway

O Railway hospeda:

- Backend Spring Boot.
- Banco MySQL.

Configure no servico do backend:

- `MYSQL_URL`
- `MYSQL_USERNAME`
- `MYSQL_PASSWORD`
- `JWT_SECRET`
- `FRONTEND_URL=https://volun-hub.vercel.app`

Variaveis como `JWT_EXPIRATION_MS`, `HIBERNATE_DIALECT` e `JPA_DDL_AUTO` podem ser ajustadas se necessario. Para Railway com MySQL, mantenha o dialect padrao MySQL.

### Vercel

A Vercel hospeda o frontend React/Vite.

Configure no projeto da Vercel:

```text
VITE_API_URL=https://volunhub-production.up.railway.app
```

O arquivo `frontend/vercel.json` configura fallback de SPA para que rotas diretas do React Router, como `/projetos`, `/login`, `/cadastro` e dashboards, carreguem o `index.html` em vez de retornarem `404`.

## Estrutura do projeto

- `backend/`: API REST em Java, Spring Boot, Spring Security, JWT, JPA e Hibernate.
- `frontend/`: aplicacao React com Vite, React Router, Axios e Tailwind CSS.
- `frontend/src/assets/images/volunhub-logo.png`: logo oficial do VolunHub incluida no repositorio.
- `frontend/public/favicon.png`: favicon oficial distribuido junto com o frontend.
- `docs/`: documentacao tecnica, requisitos, arquitetura, endpoints e validacao.
- `scripts/`: pasta reservada para scripts auxiliares.

A identidade visual oficial do VolunHub ja faz parte do codigo-fonte. Nao e necessario baixar imagens adicionais para executar o projeto por GitHub ou arquivo ZIP.

## Tecnologias utilizadas

- Java 21.
- Spring Boot 4.
- Spring Web.
- Spring Security.
- Spring Data JPA.
- Hibernate.
- MySQL Connector/J.
- MySQL ou MariaDB.
- React 18.
- Vite 5.
- React Router.
- Axios.
- Tailwind CSS.
- Maven.
- NPM.

## Problemas comuns

### CORS

Em producao, configure `FRONTEND_URL` no Railway com a origem do frontend:

```text
https://volun-hub.vercel.app
```

Localmente, o backend permite as origens de desenvolvimento e preview do Vite.

### Porta ocupada

- Backend: verifique a porta `8080`.
- Frontend dev: verifique a porta `5173`.
- Frontend preview: verifique a porta `4173`.
- Banco: verifique a porta `3306`.

Encerre o processo que esta usando a porta ou configure outra porta no servico correspondente.

### Banco nao conecta

Confirme que o MariaDB/MySQL esta iniciado, que o banco `volunhub` existe e que a URL JDBC aponta para o host e porta corretos. Confira tambem se `MYSQL_USERNAME` e `MYSQL_PASSWORD` estao definidos no mesmo terminal em que o backend e iniciado.

### Credenciais invalidas

Teste o login diretamente no banco:

```bash
mysql -u volunhub -p -h localhost -P 3306
```

Se necessario, recrie o usuario e reaplique o `GRANT`.

### Dependencias nao instaladas

No backend, confirme:

```bash
mvn -v
java -version
```

No frontend, confirme:

```bash
node -v
npm -v
npm.cmd install
```

## Distribuicao por ZIP

Uma pessoa que receber o projeto por ZIP deve seguir esta ordem:

1. Baixar o ZIP pelo GitHub ou receber o arquivo compactado.
2. Extrair o ZIP em uma pasta sem caracteres especiais no caminho, se possivel.
3. Instalar Java 21, Maven, Node.js, NPM e MariaDB/MySQL.
4. Criar o banco `volunhub`.
5. Conferir `application.properties` ou configurar variaveis de ambiente.
6. Entrar em `backend/` e executar `mvn clean package`.
7. Iniciar o backend com `mvn spring-boot:run`.
8. Entrar em `frontend/` e executar `npm.cmd install`.
9. Iniciar o frontend com `npm.cmd run dev`.
10. Acessar `http://localhost:5173`.

Arquivos locais de banco, caches, logs, instaladores e dependencias baixadas localmente nao fazem parte da distribuicao do projeto.
