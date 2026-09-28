import {conexao} from '../conexao.js'

async function editarParcialmenteCliente(id_cliente, campo, valor){
    const colunasPermitidas = ['nome', 'sobreNome', 'cpf', 'telefone', 'id_limite', 'id_endereco']
    if (!colunasPermitidas.includes(campo)) return 'Coluna inválida'

    const sql = `UPDATE Cliente SET ${campo} = ? WHERE id_cliente = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [valor, id_cliente]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarParcialmenteCliente}