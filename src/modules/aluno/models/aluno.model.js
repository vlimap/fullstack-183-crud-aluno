import alunos from "../../../config/database.js"

class AlunoModel{
    static cadastrar(matricula, nome, email){
        const aluno = { matricula, nome, email }
        alunos.push(aluno)
        return aluno
    }

    static listarTodos(){
        return alunos
    }

    static listarPorMatricula(matricula){
        const aluno = alunos.find(aluno => aluno.matricula === matricula)
        return aluno
    }

    static editarTotal(matricula, nome, email){
       const aluno = AlunoModel.listarPorMatricula(matricula)

       if(!aluno){
            return null
       }

       aluno.nome = novoNome
       aluno.email = novoEmail

       return aluno
    }

    static editarParcial(matricula, novoNome, novoEmail){
        const aluno = AlunoModel.listarPorMatricula(matricula)

        if(!aluno){
            return null
        }

        aluno.nome = novoNome || aluno.nome
        aluno.email = novoEmail || aluno.email

        return aluno
    }

    static excluir(matricula){
        const index = alunos.findIndex(aluno => aluno.matricula === matricula)

        if(index === -1){
            return null
        }

        const alunoRemovido = alunos.splice(index, 1)
        return alunoRemovido[0]
    }

    static excluirTodos(){
        alunos.length = 0
    }
}

export default AlunoModel
