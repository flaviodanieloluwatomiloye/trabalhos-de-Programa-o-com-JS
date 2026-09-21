import { conexao } from '../../conexao.js'


async function incluirUsuario(nome, email, senha) {
    const sql = `INSERT INTO tb_Usuario (nomeUsuario, emailUsuario, senhaUsuario) VALUES (?, ?, ?)`
    const pool = await conexao()
    const [results] = await pool.execute(sql, [nome, email, senha])
    return results.insertId
}

// Busca um usuário pelo e-mail
async function buscarPorEmail(email) {
    const sql = `SELECT codUsuario, nomeUsuario, emailUsuario, senhaUsuario FROM tb_Usuario WHERE emailUsuario = ?`
    const pool = await conexao()
    const [linhas] = await pool.execute(sql, [email])
    return linhas[0] ?? null
}

export { incluirUsuario, buscarPorEmail }
/* 
Cadastra um usuário e devolve o codUsuario gerado.
A senha é transformada em hash pelo próprio MySQL (SHA2 de 256 bits).
Se o e-mail já existir, o MySQL lança o erro ER_DUP_ENTRY (tratado no index.js).
 */