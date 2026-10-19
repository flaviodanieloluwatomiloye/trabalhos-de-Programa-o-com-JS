import express from 'express'

import { conexao, testarConexao } from './BackEnd/conexao.js'
import { incluirUsuario } from './BackEnd/DAO/usuario/usuario.js'
import { buscarUsuarios, buscarUsuario } from './BackEnd/DAO/usuario/buscar_usuario.js'
import { atualizarUsuario } from './BackEnd/DAO/usuario/atualizar_usuario.js'
import { excluirUsuario } from './BackEnd/DAO/usuario/excluir_usuario.js'
import { incluirAcertos } from './BackEnd/DAO/acertos/acertos.js'
import { listarAcertos, buscarAcerto } from './BackEnd/DAO/acertos/buscar_acertos.js'
import { atualizarTentativa } from './BackEnd/DAO/acertos/atualizar_acertos.js'
import { excluirAcerto } from './BackEnd/DAO/acertos/excluir_acertos.js'
import { incluirRespostas } from './BackEnd/DAO/respostas/respostas.js'
import { listarRespostasDaTentativa } from './BackEnd/DAO/respostas/buscar_respostas.js'

const app = express()

app.use(express.json())
app.use(express.static('Quiz'))

const GABARITO = ["A", "C", "D", "B", "C", "A", "C"]
const OPCOES_VALIDAS = ["A", "B", "C", "D"]

app.post('/cadastro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body ?? {}

        if (typeof nome !== 'string' || typeof email !== 'string' || typeof senha !== 'string') {
            return res.sendStatus(400)
        }

        const nomeLimpo = nome.trim()
        const emailLimpo = email.trim().toLowerCase()

        if (nomeLimpo.length < 3 || nomeLimpo.length > 30) return res.sendStatus(400)
        if (!emailLimpo.includes('@') || emailLimpo.length > 50) return res.sendStatus(400)
        if (senha.length < 8 || senha.length > 32) return res.sendStatus(400)

        // A senha vai como veio; o MySQL transforma em hash (SHA2) para que não seja visivel
        const codUsuario = await incluirUsuario(nomeLimpo, emailLimpo, senha)

        res.status(201).json({ codUsuario })
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') return res.sendStatus(409) // e-mail já cadastrado
        console.error('Erro no /cadastro:', erro.message)
        res.sendStatus(500)
    }
})


/*
 POST /resultado  ->  corrige o quiz e grava nota + cada questão
 Body: { codUsuario: 1, respostas: ["A","C","D","B","C","A","C"] }
*/
app.post('/resultado', async (req, res) => {
    const { codUsuario, respostas } = req.body ?? {}

    if (!Number.isInteger(codUsuario) || !Array.isArray(respostas)) {
        return res.sendStatus(400)
    }

    // Corrige cada questão comparando com o gabarito
    const detalhes = GABARITO.map((correta, i) => {
        const escolhida = OPCOES_VALIDAS.includes(respostas[i]) ? respostas[i] : null
        return { numero: i + 1, escolhida, correta, acertou: escolhida === correta }
    })

    // Evita gravar uma tentativa vazia (ex.: abrir resultado.html direto)
    if (detalhes.every(d => d.escolhida === null)) return res.sendStatus(400)

    const acertos = detalhes.filter(d => d.acertou).length

    let conn
    try {
        const pool = await conexao()
        conn = await pool.getConnection()

        // Transação: ou guarda a nota e as questões, ou não guarda nada
        await conn.beginTransaction()
        const codAcerto = await incluirAcertos(conn, codUsuario, acertos, GABARITO.length)
        await incluirRespostas(conn, codAcerto, detalhes)
        await conn.commit()

        res.status(201).json({ codAcerto, acertos, total: GABARITO.length, detalhes })
    } catch (erro) {
        if (conn) await conn.rollback()
        if (erro.code === 'ER_NO_REFERENCED_ROW_2') return res.sendStatus(404) // usuário não existe
        console.error('Erro no /resultado:', erro.message)
        res.sendStatus(500)
    } finally {
        if (conn) conn.release()
    }
})


/* ============================================================
   PAINEL: consulta, edição e exclusão dos dados salvos no banco
   ============================================================ */

// Converte o :id da URL em inteiro positivo (ou null se for lixo)
function lerId(valor) {
    const n = Number(valor)
    return Number.isInteger(n) && n > 0 ? n : null
}

/*
 GET /usuarios  ->  lista usuários (sem senha) + quantidade de tentativas de cada um
*/
app.get('/usuarios', async (req, res) => {
    try {
        res.json(await buscarUsuarios())
    } catch (erro) {
        console.error('Erro no GET /usuarios:', erro.message)
        res.sendStatus(500)
    }
})

app.get('/acertos', async (req, res) => {
    try {
        const pool = await conexao()
        res.json(await listarAcertos(pool))
    } catch (erro) {
        console.error('Erro no GET /acertos:', erro.message)
        res.sendStatus(500)
    }
})

app.get('/acertos/:id', async (req, res) => {
    try {
        const codAcerto = lerId(req.params.id)
        if (!codAcerto) return res.sendStatus(400)

        const pool = await conexao()
        const acerto = await buscarAcerto(pool, codAcerto)
        if (!acerto) return res.sendStatus(404)

        const respostas = await listarRespostasDaTentativa(pool, codAcerto)
        res.json({ ...acerto, respostas })
    } catch (erro) {
        console.error('Erro no GET /acertos/:id:', erro.message)
        res.sendStatus(500)
    }
})

/*
 PUT /usuarios/:id  ->  atualiza nome e e-mail
 Body: { nome: "Ana", email: "ana@gmail.com" }   (a senha não é alterada por aqui)
*/
app.put('/usuarios/:id', async (req, res) => {
    try {
        const codUsuario = lerId(req.params.id)
        const { nome, email } = req.body ?? {}

        if (!codUsuario || typeof nome !== 'string' || typeof email !== 'string') {
            return res.sendStatus(400)
        }

        // Mesmas regras do /cadastro
        const nomeLimpo = nome.trim()
        const emailLimpo = email.trim().toLowerCase()

        if (nomeLimpo.length < 3 || nomeLimpo.length > 30) return res.sendStatus(400)
        if (!emailLimpo.includes('@') || emailLimpo.length > 50) return res.sendStatus(400)

        const afetadas = await atualizarUsuario(codUsuario, nomeLimpo, emailLimpo)
        if (afetadas === 0) return res.sendStatus(404)

        res.json(await buscarUsuario(codUsuario))
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') return res.sendStatus(409) // e-mail já usado por outro usuário
        console.error('Erro no PUT /usuarios/:id:', erro.message)
        res.sendStatus(500)
    }
})

/*
 PUT /acertos/:id  ->  corrige as respostas marcadas numa tentativa.
 O "acertou" de cada questão e a nota (AcertosUsuario) são RECALCULADOS no servidor,
 então os números nunca ficam incoerentes com as respostas.
 Body: { respostas: ["A","C",null,"B","C","A","C"] }   (null = não respondida)
*/
app.put('/acertos/:id', async (req, res) => {
    const codAcerto = lerId(req.params.id)
    const { respostas } = req.body ?? {}

    if (!codAcerto || !Array.isArray(respostas)) return res.sendStatus(400)

    // Normaliza: vazio/ausente vira null; qualquer outra coisa precisa ser A, B, C ou D
    const novas = GABARITO.map((_, i) => {
        const r = respostas[i]
        return r === undefined || r === null || r === '' ? null : r
    })
    if (novas.some(r => r !== null && !OPCOES_VALIDAS.includes(r))) return res.sendStatus(400)
    if (novas.every(r => r === null)) return res.sendStatus(400) // mesma regra do /resultado

    try {
        const atualizada = await atualizarTentativa(codAcerto, novas)
        if (!atualizada) return res.sendStatus(404)

        res.json(atualizada)
    } catch (erro) {
        console.error('Erro no PUT /acertos/:id:', erro.message)
        res.sendStatus(500)
    }
})

/*
 DELETE /acertos/:id  ->  exclui a tentativa (e, por CASCADE, as respostas dela)
*/
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const codUsuario = lerId(req.params.id)
        if (!codUsuario) return res.sendStatus(400)

        const afetadas = await excluirUsuario(codUsuario)
        if (afetadas === 0) return res.sendStatus(404)

        res.sendStatus(204)
    } catch (erro) {
        console.error('Erro no DELETE /usuarios/:id:', erro.message)
        res.sendStatus(500)
    }
})

app.delete('/acertos/:id', async (req, res) => {
    try {
        const codAcerto = lerId(req.params.id)
        if (!codAcerto) return res.sendStatus(400)

        const afetadas = await excluirAcerto(codAcerto)
        if (afetadas === 0) return res.sendStatus(404)

        res.sendStatus(204)
    } catch (erro) {
        console.error('Erro no DELETE /acertos/:id:', erro.message)
        res.sendStatus(500)
    }
})


app.listen(3000, async () => {
    console.log('Servidor rodando em http://localhost:3000/paginas/index.html')
    await testarConexao()
})

/*
200 - OK                 Consulta ou atualização feita com sucesso
201 - Criado com sucesso Usuário cadastrado, ou resultado do quiz gravado
204 - Sem conteúdo       Exclusão feita com sucesso
400	- Requisição inválida Dados fora do padrão: nome curto, senha curta, e-mail sem @, tentativa sem nenhuma resposta
404	- Não encontrado /resultado com um codUsuario que não existe; PUT/DELETE de um id que não existe
409	- Conflito E-mail já cadastrado (no cadastro ou ao editar um usuário)
500	- Erro interno do servidor Qualquer falha inesperada, como o MySQL estar desligado
*/
