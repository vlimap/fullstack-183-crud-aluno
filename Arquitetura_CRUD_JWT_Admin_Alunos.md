# Arquitetura do Projeto – CRUD de Alunos com Autenticação JWT

## Objetivo

O sistema possuirá apenas um tipo de usuário autenticado: **Administrador**.

O administrador será responsável por:

- Realizar o cadastro inicial
- Fazer login
- Receber um JWT
- Cadastrar alunos
- Editar alunos
- Excluir alunos
- Consultar alunos

Os alunos **não fazem login**. Eles são apenas registros administrados pelo sistema.

---

# Arquitetura

```text
Administrador
    │
    ├── Faz login
    ├── Recebe JWT
    ├── Cadastra alunos
    ├── Edita alunos
    ├── Exclui alunos
    └── Consulta alunos

Aluno
    └── Apenas um registro do banco
```

# Estrutura do Backend

```text
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── middlewares/
│   │   └── autenticacao.middleware.js
│   ├── modules/
│   │   ├── admin/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   └── routes/
│   │   └── aluno/
│   │       ├── controllers/
│   │       ├── models/
│   │       └── routes/
│   └── index.js
├── .env
├── .env.example
└── package.json
```

# Banco de Dados

## admins

```sql
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## alunos

```sql
CREATE TABLE alunos (
    matricula VARCHAR(9) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
);
```

# Dependências

```bash
npm install bcryptjs jsonwebtoken cors
```

# Rotas Públicas

```text
POST /admin/cadastrar
POST /admin/login
GET /
```

# Rotas Protegidas

```text
GET    /admin/perfil

GET    /listar
GET    /listar/:matricula
POST   /cadastrar
PUT    /editar/total/:matricula
PATCH  /editar/parcial/:matricula
DELETE /excluir/:matricula
DELETE /excluir/todos
```

# Fluxo

```text
Cadastro do Administrador
        ↓
Senha criptografada (bcrypt)
        ↓
PostgreSQL
        ↓
Login
        ↓
JWT
        ↓
Frontend salva token
        ↓
Authorization: Bearer TOKEN
        ↓
Middleware
        ↓
CRUD de Alunos
```

# Organização do Frontend

```text
frontend/
├── src/
│   ├── components/
│   │   ├── AdminCadastroForm.jsx
│   │   ├── LoginForm.jsx
│   │   ├── AlunoForm.jsx
│   │   ├── AlunoLista.jsx
│   │   └── AlunoItem.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── adminService.js
│   │   └── alunoService.js
│   ├── App.jsx
│   └── main.jsx
```

# Sequência de Aulas

1. PostgreSQL e tabela admins
2. Cadastro do administrador
3. Login e JWT
4. Middleware
5. CRUD de alunos protegido
6. React + Axios + localStorage

# Resumo

```text
Admin
    ↓
Login
    ↓
JWT
    ↓
Middleware
    ↓
CRUD de Alunos
    ↓
PostgreSQL
```
