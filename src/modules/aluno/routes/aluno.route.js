import express from 'express'
import AlunoController from "../controllers/aluno.controller.js";

const router = express.Router();

router.get("/listar", AlunoController.listarTodos)
router.get("/listar/:matricula", AlunoController.listarPorMatricula)
router.post("/cadastrar", AlunoController.cadastrar)
router.put("/editar/total/:matricula", AlunoController.editarTotal)
router.patch("/editar/parcial/:matricula", AlunoController.editarParcial)
router.delete("/excluir/:matricula", AlunoController.excluirPorMatricula)
router.delete("/excluir/todos", AlunoController.excluirTodos )

export default router
