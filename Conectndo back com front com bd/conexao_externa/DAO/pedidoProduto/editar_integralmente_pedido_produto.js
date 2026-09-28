import {conexao} from '../conexao.js'

async function editarIntegralmentePedidoProduto(id_pedido, id_produto, infos){
    const sql = `UPDATE Pedido_Produto SET id_pedido = ?, id_produto = ? WHERE id_pedido = ? AND id_produto = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [...infos, id_pedido, id_produto]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarIntegralmentePedidoProduto}