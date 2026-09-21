import express from 'express'

import { conexao, testarConexao } from './BackEnd/conexao.js'
import { incluirUsuario } from './BackEnd/DAO/usuario/usuario.js'
import { incluirAcertos } from './BackEnd/DAO/acertos/acertos.js'
import { incluirRespostas } from './BackEnd/DAO/respostas/respostas.js'

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


app.listen(3000, async () => {
    console.log('Servidor rodando em http://localhost:3000/paginas/index.html')
    await testarConexao()
})

/*
201 - Criado com sucesso Usuário cadastrado, ou resultado do quiz gravado
400	- Requisição inválida Dados fora do padrão: nome curto, senha curta, e-mail sem @, tentativa sem nenhuma resposta
404	- Não encontrado /resultado com um codUsuario que não existe no banco
409	- Conflito E-mail já cadastrado
500	- Erro interno do servidor Qualquer falha inesperada, como o MySQL estar desligado
*/