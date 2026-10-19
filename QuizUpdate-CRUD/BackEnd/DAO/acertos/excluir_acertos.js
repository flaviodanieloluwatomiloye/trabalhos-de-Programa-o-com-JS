import { conexao } from '../../conexao.js'

// Exclui a tentativa. O ON DELETE CASCADE apaga as respostas dela.
// Devolve quantas linhas foram apagadas (0 = tentativa não existe).
async function excluirAcerto(codAcerto) {
    const sql = `DELETE FROM tb_Acertos WHERE codAcerto = ?`
    const pool = await conexao()
    const [results] = await pool.execute(sql, [codAcerto])
    return results.affectedRows
}

export { excluirAcerto }
