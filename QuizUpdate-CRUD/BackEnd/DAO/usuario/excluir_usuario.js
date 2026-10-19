import { conexao } from '../../conexao.js'

// Exclui o usuário. O ON DELETE CASCADE do banco apaga também as tentativas e respostas dele.
// Devolve quantas linhas foram apagadas (0 = usuário não existe).
async function excluirUsuario(codUsuario) {
    const sql = `DELETE FROM tb_Usuario WHERE codUsuario = ?`
    const pool = await conexao()
    const [results] = await pool.execute(sql, [codUsuario])
    return results.affectedRows
}

export { excluirUsuario }
