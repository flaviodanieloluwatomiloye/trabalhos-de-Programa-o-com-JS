import {conexao} from '../conexao.js'

async function editarIntegralmenteCliente(id_cliente, infos){
    const sql = `UPDATE Cliente SET nome = ?, sobreNome = ?, cpf = ?, telefone = ?, id_limite = ?, id_endereco = ? WHERE id_cliente = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [...infos, id_cliente]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarIntegralmenteCliente}