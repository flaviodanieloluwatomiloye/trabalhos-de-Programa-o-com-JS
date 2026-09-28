import {conexao} from '../conexao.js'

async function editarParcialmentePedido(numeroPedido, campo, valor){
    const colunasPermitidas = ['data_elaboracao', 'id_cliente']
    if (!colunasPermitidas.includes(campo)) return 'Coluna inválida'

    const sql = `UPDATE Pedido SET ${campo} = ? WHERE numeroPedido = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [valor, numeroPedido]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarParcialmentePedido}