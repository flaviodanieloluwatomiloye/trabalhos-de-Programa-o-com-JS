import {conexao} from '../conexao.js'

async function editarParcialmenteProduto(id_produto, campo, valor){
    const colunasPermitidas = ['nome', 'descricao', 'preco']
    if (!colunasPermitidas.includes(campo)) return 'Coluna inválida'

    const sql = `UPDATE Produto SET ${campo} = ? WHERE id_produto = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [valor, id_produto]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarParcialmenteProduto}