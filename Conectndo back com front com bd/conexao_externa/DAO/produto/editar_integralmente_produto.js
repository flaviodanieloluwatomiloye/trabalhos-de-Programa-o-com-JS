import {conexao} from '../conexao.js'

async function editarIntegralmenteProduto(id_produto, infos){
    const sql = `UPDATE Produto SET nome = ?, descricao = ?, preco = ? WHERE id_produto = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [...infos, id_produto]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarIntegralmenteProduto}