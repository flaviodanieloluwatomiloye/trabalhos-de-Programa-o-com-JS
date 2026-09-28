import {conexao} from '../conexao.js'

async function editarParcialmentePedidoProduto(id_pedido, id_produto, campo, valor){
    const colunasPermitidas = ['id_pedido', 'id_produto']
    if (!colunasPermitidas.includes(campo)) return 'Coluna inválida'

    const sql = `UPDATE Pedido_Produto SET ${campo} = ? WHERE id_pedido = ? AND id_produto = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [valor, id_pedido, id_produto]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarParcialmentePedidoProduto}