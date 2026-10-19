import { conexao } from '../../conexao.js'

// Lista todos os usuários + quantas tentativas cada um já fez.
// A senha NUNCA sai daqui: a tela não precisa dela.
async function buscarUsuarios() {
    const sql = `SELECT u.codUsuario, u.nomeUsuario, u.emailUsuario, u.dataCadastro,
                        COUNT(a.codAcerto) AS totalTentativas
                   FROM tb_Usuario u
                   LEFT JOIN tb_Acertos a ON a.codUsuario = u.codUsuario
                  GROUP BY u.codUsuario, u.nomeUsuario, u.emailUsuario, u.dataCadastro
                  ORDER BY u.codUsuario`
    const pool = await conexao()
    const [linhas] = await pool.execute(sql)
    return linhas
}

async function buscarUsuario(codUsuario) {
    const sql = `SELECT codUsuario, nomeUsuario, emailUsuario, dataCadastro
                   FROM tb_Usuario
                  WHERE codUsuario = ?`
    const pool = await conexao()
    const [linhas] = await pool.execute(sql, [codUsuario])
    return linhas[0] ?? null
}

export { buscarUsuario, buscarUsuarios }
