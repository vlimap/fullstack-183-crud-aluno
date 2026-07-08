# Convenções de Código

Este documento define as convenções de nomenclatura e organização utilizadas no projeto.

O objetivo é manter o código consistente, legível, previsível e fácil de manter.

---

## 1. Regras gerais

- Utilize nomes claros e descritivos.
- Evite abreviações desnecessárias.
- Mantenha um único idioma no código.
- Prefira nomes que expressem a responsabilidade da variável, função ou classe.
- Evite variáveis globais sempre que possível.
- Siga o padrão oficial da linguagem, framework ou biblioteca utilizada.
- Quando não existir uma regra específica, priorize consistência com o restante do projeto.

---

## 2. Variáveis de ambiente

Variáveis de ambiente devem utilizar o padrão `UPPER_SNAKE_CASE`.

### Correto

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/database
JWT_SECRET=secret
API_BASE_URL=https://api.example.com
```

### Incorreto

```env
port=3000
databaseUrl=postgresql://localhost/database
jwtSecret=secret
api-base-url=https://api.example.com
```

No código, a variável deve ser acessada utilizando exatamente o nome definido no ambiente:

```ts
const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
```

---

## 3. Variáveis globais

Variáveis globais devem utilizar `camelCase`.

```ts
let activeConnections = 0;
let applicationStatus = "starting";
let currentUser = null;
```

Apesar da convenção, o uso de variáveis globais mutáveis deve ser evitado.

Prefira encapsular o estado em:

- módulos;
- classes;
- serviços;
- contextos;
- stores;
- contêineres de injeção de dependência.

### Constantes globais

Constantes globais imutáveis podem utilizar `UPPER_SNAKE_CASE`.

```ts
const MAX_LOGIN_ATTEMPTS = 5;
const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
```

Resumo:

| Tipo | Convenção |
|---|---|
| Variável global mutável | `camelCase` |
| Constante global imutável | `UPPER_SNAKE_CASE` |

---

## 4. Variáveis locais

Variáveis locais devem utilizar `camelCase`.

```ts
const userName = "Valtemir";
const authenticatedUser = await findUserById(userId);
const registeredStudents = [];
const currentDate = new Date();
```

Evite nomes genéricos ou excessivamente curtos:

```ts
// Evitar
const data = {};
const item = {};
const x = 10;
const arr = [];
```

Prefira nomes que indiquem o conteúdo:

```ts
const userData = {};
const selectedProduct = {};
const maximumAttempts = 10;
const registeredUsers = [];
```

---

## 5. Constantes locais

Constantes locais devem utilizar `camelCase`.

O uso de `const` não significa que o nome deve obrigatoriamente ser escrito em letras maiúsculas.

```ts
const userName = "Valtemir";
const defaultPageSize = 20;
const generatedToken = createToken();
```

Utilize `UPPER_SNAKE_CASE` somente para constantes técnicas, fixas e compartilhadas:

```ts
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_RETRY_ATTEMPTS = 3;
export const REQUEST_TIMEOUT_MS = 10_000;
```

---

## 6. Funções

Funções devem utilizar `camelCase`.

O nome deve começar, preferencialmente, com um verbo que descreva sua responsabilidade.

```ts
function createUser() {}

function findStudentById() {}

function calculateOrderTotal() {}

function validateAccessToken() {}

function sendWelcomeEmail() {}
```

### Funções assíncronas

Funções assíncronas seguem o mesmo padrão.

```ts
async function fetchUserProfile() {}

async function saveStudentEnrollment() {}

async function synchronizeExternalData() {}
```

Não é necessário utilizar o sufixo `Async`:

```ts
// Evitar
async function fetchUserProfileAsync() {}

// Preferir
async function fetchUserProfile() {}
```

---

## 7. Valores booleanos

Variáveis e funções booleanas devem indicar claramente uma condição.

Prefixos recomendados:

- `is`;
- `has`;
- `can`;
- `should`;
- `was`;
- `will`.

### Variáveis

```ts
const isAuthenticated = true;
const hasPermission = false;
const canEditProfile = true;
const shouldSendNotification = false;
const isLoading = false;
```

### Funções

```ts
function isAuthenticated() {}

function hasPermission() {}

function canUpdateUser() {}

function shouldRefreshToken() {}
```

Evite:

```ts
const authenticated = true;
const permission = false;
const loading = true;
```

---

## 8. Classes

Classes devem utilizar `PascalCase`.

```ts
class UserService {}

class AuthenticationController {}

class StudentRepository {}

class DatabaseConnection {}
```

Classes devem possuir nomes específicos e relacionados à sua responsabilidade.

```ts
class CreateStudentUseCase {}

class PostgreSqlUserRepository {}

class JwtTokenProvider {}
```

Evite nomes genéricos:

```ts
class Manager {}

class Helper {}

class Utils {}
```

---

## 9. Interfaces e tipos

Interfaces e tipos devem utilizar `PascalCase`.

```ts
interface User {
  id: string;
  name: string;
  email: string;
}

type UserStatus = "active" | "inactive";

type CreateUserInput = {
  name: string;
  email: string;
};
```

Não utilize o prefixo `I` em interfaces.

```ts
// Evitar
interface IUser {}

interface IUserRepository {}

// Preferir
interface User {}

interface UserRepository {}
```

---

## 10. Enums

Enums devem utilizar `PascalCase`.

```ts
enum UserRole {
  Admin = "ADMIN",
  Teacher = "TEACHER",
  Student = "STUDENT",
}
```

Quando os valores forem persistidos no banco ou enviados por API, utilize `UPPER_SNAKE_CASE`.

```ts
enum PaymentStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}
```

Em TypeScript, objetos constantes também podem ser utilizados:

```ts
export const userRole = {
  admin: "ADMIN",
  teacher: "TEACHER",
  student: "STUDENT",
} as const;

export type UserRole = (typeof userRole)[keyof typeof userRole];
```

---

## 11. Objetos

Objetos e suas propriedades devem utilizar `camelCase`.

```ts
const authenticatedUser = {
  id: "1",
  fullName: "Valtemir Procopio",
  emailAddress: "usuario@example.com",
  isActive: true,
};
```

Quando uma API externa utilizar outro padrão, normalize os dados na camada de integração.

```ts
const externalUser = {
  full_name: "Valtemir Procopio",
  email_address: "usuario@example.com",
};

const normalizedUser = {
  fullName: externalUser.full_name,
  emailAddress: externalUser.email_address,
};
```

---

## 12. Arrays e coleções

Arrays e coleções devem utilizar nomes no plural.

```ts
const users = [];
const registeredStudents = [];
const pendingOrders = [];
const availableCourses = [];
```

Evite:

```ts
const user = [];
const studentList = [];
const arrayUsers = [];
```

O nome no plural já indica que a variável representa uma coleção.

---

## 13. Identificadores

Identificadores devem indicar a entidade à qual pertencem.

```ts
const userId = "uuid";
const studentId = "uuid";
const classroomId = "uuid";
const orderId = "uuid";
```

Evite identificadores genéricos fora de contextos pequenos:

```ts
const id = "uuid";
```

Em funções curtas, `id` pode ser utilizado quando a entidade estiver evidente:

```ts
function findUserById(id: string) {
  return users.find((user) => user.id === id);
}
```

---

## 14. Parâmetros de funções

Parâmetros devem utilizar `camelCase`.

```ts
function createUser(userData: CreateUserInput) {}

function updateStudent(
  studentId: string,
  studentData: UpdateStudentInput,
) {}
```

Quando uma função possuir muitos parâmetros, utilize um objeto.

```ts
type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
};

function createUser(input: CreateUserInput) {}
```

Evite:

```ts
function createUser(
  name: string,
  email: string,
  password: string,
  role: string,
  phone: string,
) {}
```

---

## 15. Componentes React

Componentes React devem utilizar `PascalCase`.

```tsx
export function UserProfile() {
  return <section>User profile</section>;
}

export function StudentList() {
  return <section>Student list</section>;
}
```

Arquivos de componentes também devem utilizar `PascalCase`.

```text
UserProfile.tsx
StudentList.tsx
AuthenticationForm.tsx
DashboardHeader.tsx
```

### Props

Props devem utilizar `camelCase`.

```tsx
type UserCardProps = {
  userName: string;
  profileImageUrl: string;
  isActive: boolean;
};

export function UserCard({
  userName,
  profileImageUrl,
  isActive,
}: UserCardProps) {
  return (
    <article>
      <img src={profileImageUrl} alt={userName} />
      <strong>{userName}</strong>
      <span>{isActive ? "Active" : "Inactive"}</span>
    </article>
  );
}
```

---

## 16. Hooks React

Hooks devem utilizar `camelCase` e começar obrigatoriamente com `use`.

```ts
function useAuthentication() {}

function useCurrentUser() {}

function useStudents() {}

function usePagination() {}
```

Arquivos de hooks:

```text
useAuthentication.ts
useCurrentUser.ts
useStudents.ts
usePagination.ts
```

---

## 17. Manipuladores de eventos

Funções internas que manipulam eventos devem utilizar o prefixo `handle`.

```tsx
function handleSubmit() {}

function handleInputChange() {}

function handleModalClose() {}
```

Props que recebem callbacks devem utilizar o prefixo `on`.

```tsx
type UserFormProps = {
  onSubmit: () => void;
  onCancel: () => void;
};
```

Exemplo:

```tsx
function UserForm({ onSubmit, onCancel }: UserFormProps) {
  function handleSubmit() {
    onSubmit();
  }

  function handleCancel() {
    onCancel();
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Save</button>

      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}
```

---

## 18. Serviços, repositórios e casos de uso

Os nomes devem representar claramente a responsabilidade arquitetural.

### Serviços

```text
UserService
AuthenticationService
EmailService
PaymentService
```

### Repositórios

```text
UserRepository
StudentRepository
PostgreSqlUserRepository
PrismaStudentRepository
```

### Casos de uso

```text
CreateUserUseCase
AuthenticateUserUseCase
UpdateStudentUseCase
DeleteClassroomUseCase
```

### Controllers

```text
UserController
AuthenticationController
StudentController
ClassroomController
```

---

## 19. Rotas HTTP

Rotas REST devem utilizar letras minúsculas e `kebab-case` quando necessário.

```text
/users
/users/:userId
/student-enrollments
/password-reset
/auth/refresh-token
```

Recursos devem utilizar substantivos, preferencialmente no plural.

```http
GET /users
GET /users/:userId
POST /users
PATCH /users/:userId
DELETE /users/:userId
```

Evite verbos nas rotas:

```http
GET /getUsers
POST /createUser
PUT /updateUser/:id
DELETE /deleteUser/:id
```

A ação já é representada pelo método HTTP.

---

## 20. Parâmetros de rota e query string

Parâmetros de rota devem utilizar `camelCase`.

```http
GET /users/:userId
GET /classrooms/:classroomId
GET /students/:studentId/enrollments
```

```ts
const { userId } = request.params;
```

Query parameters também devem utilizar `camelCase`.

```http
GET /users?page=1&pageSize=20
GET /students?classroomId=123
GET /orders?startDate=2026-01-01&endDate=2026-12-31
```

---

## 21. Respostas de API

Propriedades JSON devem utilizar `camelCase`.

```json
{
  "id": "1",
  "fullName": "Valtemir Procopio",
  "emailAddress": "usuario@example.com",
  "createdAt": "2026-07-02T12:00:00.000Z",
  "isActive": true
}
```

### Paginação

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalItems": 0,
  "totalPages": 0
}
```

### Erros

```json
{
  "message": "User not found",
  "code": "USER_NOT_FOUND",
  "details": null
}
```

Códigos de erro devem utilizar `UPPER_SNAKE_CASE`.

```text
USER_NOT_FOUND
INVALID_CREDENTIALS
EMAIL_ALREADY_EXISTS
ACCESS_DENIED
```

---

## 22. Banco de dados

Tabelas e colunas devem utilizar `snake_case`.

### Tabelas

```text
users
student_enrollments
class_records
refresh_tokens
password_reset_tokens
```

### Colunas

```text
id
full_name
email_address
password_hash
created_at
updated_at
deleted_at
is_active
```

### Chaves estrangeiras

```text
user_id
student_id
classroom_id
teacher_id
```

Na aplicação, os campos devem ser convertidos para `camelCase`.

| Banco de dados | Aplicação |
|---|---|
| `created_at` | `createdAt` |
| `updated_at` | `updatedAt` |
| `user_id` | `userId` |
| `full_name` | `fullName` |

---

## 23. Arquivos

A convenção depende da responsabilidade do arquivo.

### Componentes e classes

Utilize `PascalCase`.

```text
UserProfile.tsx
StudentController.ts
CreateUserUseCase.ts
PostgreSqlUserRepository.ts
```

### Funções e utilitários

Utilize `camelCase`.

```text
formatDate.ts
generateToken.ts
validateEmail.ts
createLogger.ts
```

### Arquivos de configuração

Mantenha o padrão esperado pela ferramenta.

```text
eslint.config.js
vite.config.ts
commitlint.config.js
docker-compose.yml
package.json
tsconfig.json
Dockerfile
README.md
.env
.env.example
.gitignore
```

---

## 24. Diretórios

Diretórios devem utilizar `kebab-case`.

```text
src/
├── application/
├── domain/
├── infrastructure/
├── shared/
├── user-management/
├── authentication/
└── database/
```

Evite misturar padrões:

```text
UserManagement/
user_management/
usermanagement/
```

---

## 25. CSS

Classes CSS devem utilizar `kebab-case`.

```css
.user-profile {
  display: flex;
}

.user-profile-header {
  align-items: center;
}

.is-active {
  opacity: 1;
}
```

Em CSS Modules, as propriedades importadas podem utilizar `camelCase`.

```css
.userProfile {
  display: flex;
}
```

```tsx
import styles from "./UserProfile.module.css";

export function UserProfile() {
  return <section className={styles.userProfile}>Profile</section>;
}
```

---

## 26. Erros personalizados

Classes de erro devem utilizar `PascalCase` e terminar com `Error`.

```ts
class ApplicationError extends Error {}

class ValidationError extends Error {}

class ResourceNotFoundError extends Error {}

class UnauthorizedError extends Error {}
```

Códigos internos devem utilizar `UPPER_SNAKE_CASE`.

```ts
const errorCode = "USER_NOT_FOUND";
const validationCode = "INVALID_EMAIL_ADDRESS";
```

---

## 27. Testes

Arquivos de teste devem manter o nome do arquivo testado e utilizar `.test` ou `.spec`.

```text
UserService.test.ts
AuthenticationController.spec.ts
createUserUseCase.test.ts
```

O projeto deve escolher um dos padrões e utilizá-lo consistentemente.

```ts
describe("CreateUserUseCase", () => {
  it("should create a user with valid data", async () => {
    // Arrange
    // Act
    // Assert
  });

  it("should not create a user with an existing email", async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Mocks devem indicar claramente o objeto simulado:

```ts
const userRepositoryMock = {
  findByEmail: vi.fn(),
  create: vi.fn(),
};

const emailServiceMock = {
  sendWelcomeEmail: vi.fn(),
};
```

---

## 28. Comentários

Comentários devem explicar a motivação ou uma decisão técnica.

Evite comentários que apenas repetem o código:

```ts
// Evitar: incrementa o contador
counter += 1;
```

Prefira:

```ts
// Limita a paginação ao máximo aceito pela API externa.
const pageSize = Math.min(requestedPageSize, 100);
```

Marcadores permitidos:

```ts
// TODO: Implementar cache distribuído.

// FIXME: Corrigir condição de concorrência durante a sincronização.

// NOTE: A API externa aceita somente datas em UTC.
```

---

## 29. Abreviações

Abreviações conhecidas devem ser tratadas como palavras normais.

```ts
const userId = "1";
const apiUrl = "https://example.com";
const htmlContent = "<p>Content</p>";

class ApiClient {}

class HttpRequest {}

class JwtTokenProvider {}
```

Evite:

```ts
const userID = "1";
const APIUrl = "https://example.com";

class APIClient {}

class HTTPRequest {}

class JWTTokenProvider {}
```

---

## 30. Datas e horários

Variáveis de data devem indicar claramente o que representam.

```ts
const createdAt = new Date();
const updatedAt = new Date();
const expiresAt = new Date();
const startDate = new Date();
const endDate = new Date();
```

Datas enviadas por API devem utilizar ISO 8601.

```text
2026-07-02T12:00:00.000Z
```

---

## 31. Unidades de medida

Quando uma variável possuir uma unidade, informe-a no nome.

```ts
const timeoutMs = 5_000;
const durationSeconds = 60;
const fileSizeBytes = 1_024;
const distanceMeters = 500;
```

Também podem ser utilizados nomes mais explícitos:

```ts
const timeoutInMilliseconds = 5_000;
const durationInSeconds = 60;
const fileSizeInBytes = 1_024;
```

---

## 32. Valores monetários

Valores monetários devem utilizar a menor unidade da moeda.

```ts
const priceInCents = 19_990;
const totalAmountInCents = 35_000;
```

Quando houver mais de uma moeda, informe a moeda no nome:

```ts
const priceInBrlCents = 19_990;
const priceInUsdCents = 3_500;
```

Evite realizar cálculos financeiros diretamente com números decimais:

```ts
const price = 199.9;
```

---

## 33. Resumo das convenções

| Elemento | Convenção | Exemplo |
|---|---|---|
| Variável de ambiente | `UPPER_SNAKE_CASE` | `DATABASE_URL` |
| Variável global mutável | `camelCase` | `activeConnections` |
| Constante global | `UPPER_SNAKE_CASE` | `MAX_RETRY_ATTEMPTS` |
| Variável local | `camelCase` | `authenticatedUser` |
| Constante local | `camelCase` | `defaultPageSize` |
| Função | `camelCase` | `createUser` |
| Função booleana | Prefixo booleano | `isAuthenticated` |
| Classe | `PascalCase` | `UserService` |
| Interface | `PascalCase` | `UserRepository` |
| Tipo | `PascalCase` | `CreateUserInput` |
| Enum | `PascalCase` | `UserRole` |
| Componente React | `PascalCase` | `UserProfile` |
| Hook React | Prefixo `use` | `useAuthentication` |
| Manipulador interno | Prefixo `handle` | `handleSubmit` |
| Callback recebido | Prefixo `on` | `onSubmit` |
| Rota HTTP | `kebab-case` | `/password-reset` |
| Parâmetro de rota | `camelCase` | `:userId` |
| Propriedade JSON | `camelCase` | `createdAt` |
| Código de erro | `UPPER_SNAKE_CASE` | `USER_NOT_FOUND` |
| Tabela do banco | `snake_case` | `student_enrollments` |
| Coluna do banco | `snake_case` | `created_at` |
| Diretório | `kebab-case` | `user-management` |
| Classe CSS | `kebab-case` | `.user-profile` |
| Arquivo de componente | `PascalCase` | `UserProfile.tsx` |
| Arquivo utilitário | `camelCase` | `formatDate.ts` |

---

## 34. Regra de decisão

Quando não existir uma regra específica neste documento, utilize a seguinte ordem:

1. Siga o padrão oficial da linguagem, framework ou biblioteca.
2. Siga o padrão predominante no projeto.
3. Utilize o nome mais claro e descritivo.
4. Mantenha consistência com módulos relacionados.
5. Evite criar uma nova convenção sem necessidade.

A consistência do projeto deve prevalecer sobre preferências individuais.
