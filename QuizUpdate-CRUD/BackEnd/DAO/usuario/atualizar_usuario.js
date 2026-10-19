import { conexao } from '../../conexao.js'

// Atualiza nome e e-mail. Devolve quantas linhas casaram (0 = usuário não existe).
// A senha não é alterada aqui.
async function atualizarUsuario(codUsuario, nome, email) {
    const sql = `UPDATE tb_Usuario SET nomeUsuario = ?, emailUsuario = ? WHERE codUsuario = ?`
    const pool = await conexao()
    const [results] = await pool.execute(sql, [nome, email, codUsuario])
    return results.affectedRows
}

export { atualizarUsuario }
