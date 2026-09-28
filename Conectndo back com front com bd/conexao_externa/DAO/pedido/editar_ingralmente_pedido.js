import {conexao} from '../conexao.js'

async function editarIntegralmentePedido(numeroPedido, infos){
    const sql = `UPDATE Pedido SET data_elaboracao = ?, id_cliente = ? WHERE numeroPedido = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [...infos, numeroPedido]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarIntegralmentePedido}