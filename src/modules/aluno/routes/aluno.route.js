// Importa o express para usar o recurso de Router.
import express from "express";

// Importa o controller de alunos.
// Cada rota abaixo vai chamar um metodo desse controller.
import AlunoController from "../controllers/aluno.controller.js";

// Cria um roteador.
// O Router permite separar as rotas em arquivos menores e mais organizados.
const router = express.Router();

// Rota para listar todos os alunos.
// Metodo GET e usado para buscar dados.
router.get("/listar", AlunoController.listarTodos);

// Rota para listar um aluno especifico pela matricula.
// O trecho :matricula e um parametro de rota.
// Exemplo: /listar/a92222
router.get("/listar/:matricula", AlunoController.listarPorMatricula);

// Rota para cadastrar um novo aluno.
// Metodo POST e usado para criar um novo recurso.
router.post("/cadastrar", AlunoController.cadastrar);

// Rota para editar completamente um aluno.
// Metodo PUT e usado quando queremos enviar todos os dados editaveis.
router.put("/editar/total/:matricula", AlunoController.editarTotal);

// Rota para editar parcialmente um aluno.
// Metodo PATCH e usado quando queremos enviar apenas alguns campos.
router.patch("/editar/parcial/:matricula", AlunoController.editarParcial);

// Esta rota precisa vir antes de /excluir/:matricula.
// Se viesse depois, a palavra "todos" poderia ser interpretada como uma matricula.
router.delete("/excluir/todos", AlunoController.excluirTodos);

// Rota para excluir apenas um aluno pela matricula.
router.delete("/excluir/:matricula", AlunoController.excluirPorMatricula);

export default router;
