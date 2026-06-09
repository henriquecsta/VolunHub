# VolunHub

VolunHub e uma aplicacao web para conectar voluntarios a organizacoes sociais. O projeto possui backend Spring Boot, frontend React/Vite e banco relacional MySQL/MariaDB executado fora do repositorio.

## Requisitos

- Java 21.
- Maven 3.9 ou superior.
- Node.js 18 ou superior.
- NPM.
- MariaDB ou MySQL instalado na maquina.
- Git opcional, para clonar o repositorio.

## Instalacao do banco

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

6. Configure a conexao do backend por variaveis de ambiente ou ajuste `backend/src/main/resources/application.properties`.

Padrao atual do backend:

```properties
spring.datasource.url=${MYSQL_URL:jdbc:mysql://localhost:3306/volunhub?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}
spring.datasource.username=${MYSQL_USERNAME:root}
spring.datasource.password=${MYSQL_PASSWORD:root}
```

Exemplo com PowerShell:

```powershell
$env:MYSQL_URL="jdbc:mysql://localhost:3306/volunhub?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:MYSQL_USERNAME="volunhub"
$env:MYSQL_PASSWORD="volunhub123"
$env:JWT_SECRET="troque-este-segredo-em-ambientes-reais"
```

Exemplo com Bash:

```bash
export MYSQL_URL="jdbc:mysql://localhost:3306/volunhub?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export MYSQL_USERNAME="volunhub"
export MYSQL_PASSWORD="volunhub123"
export JWT_SECRET="troque-este-segredo-em-ambientes-reais"
```

Se o banco estiver em outra porta, troque `3306` na URL. Nao crie pastas como `data/`, `.local-mariadb/` ou `mysql-data/` dentro do repositorio.

## Instalacao do backend

Clone ou extraia o projeto e entre na pasta do backend:

```bash
git clone <url-do-repositorio>
cd VolunHub/backend
```

Se voce baixou por ZIP, entre na pasta extraida e depois em `backend`.

Baixe dependencias e gere o pacote:

```bash
mvn clean package
```

Execute o Spring Boot:

```bash
mvn spring-boot:run
```

O backend sobe por padrao em `http://localhost:8080`.

## Instalacao do frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd VolunHub/frontend
```

Instale as dependencias:

```bash
npm install
```

Execute em desenvolvimento:

```bash
npm run dev
```

O Vite normalmente abre em `http://localhost:5173`.

Gere o build de producao:

```bash
npm run build
```

Para validar o build localmente:

```bash
npm run preview
```

O preview normalmente usa `http://localhost:4173`.

## Primeira execucao

1. Inicie o MariaDB ou MySQL.
2. Crie o banco `volunhub` e configure usuario/senha.
3. Configure as variaveis `MYSQL_URL`, `MYSQL_USERNAME`, `MYSQL_PASSWORD` e, se necessario, `JWT_SECRET`.
4. Inicie o backend com `mvn spring-boot:run`.
5. Inicie o frontend com `npm run dev`.
6. Acesse `http://localhost:5173`.

## Estrutura do projeto

- `backend/`: API REST em Java, Spring Boot, Spring Security, JWT, JPA e Hibernate.
- `frontend/`: aplicacao React com Vite, React Router, Axios e Tailwind CSS.
- `docs/`: documentacao tecnica, requisitos, arquitetura, endpoints e validacao.
- `scripts/`: pasta reservada para scripts auxiliares.

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

O backend permite as origens locais `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:4173` e `http://127.0.0.1:4173`. Se o frontend rodar em outra porta ou host, ajuste a configuracao CORS em `backend/src/main/java/com/volunhub/backend/config/SecurityConfig.java`.

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
npm install
```

## Deploy local

Para executar o sistema completo localmente em modo de validacao:

1. Inicie o MariaDB/MySQL.
2. Configure o banco e as variaveis de ambiente.
3. Rode o backend em `backend/`:

```bash
mvn spring-boot:run
```

4. Rode o frontend em `frontend/`:

```bash
npm run dev
```

Para simular o frontend em producao:

```bash
npm run build
npm run preview
```

Mantenha o backend ativo enquanto usa o frontend.

## Distribuicao por ZIP

Uma pessoa que receber o projeto por ZIP deve seguir esta ordem:

1. Baixar o ZIP pelo GitHub ou receber o arquivo compactado.
2. Extrair o ZIP em uma pasta sem caracteres especiais no caminho, se possivel.
3. Instalar Java 21, Maven, Node.js, NPM e MariaDB/MySQL.
4. Criar o banco `volunhub`.
5. Configurar `MYSQL_URL`, `MYSQL_USERNAME` e `MYSQL_PASSWORD`.
6. Entrar em `backend/` e executar `mvn clean package`.
7. Iniciar o backend com `mvn spring-boot:run`.
8. Entrar em `frontend/` e executar `npm install`.
9. Iniciar o frontend com `npm run dev`.
10. Acessar `http://localhost:5173`.

Arquivos locais de banco, caches, logs, instaladores e dependencias baixadas localmente nao fazem parte da distribuicao do projeto.
