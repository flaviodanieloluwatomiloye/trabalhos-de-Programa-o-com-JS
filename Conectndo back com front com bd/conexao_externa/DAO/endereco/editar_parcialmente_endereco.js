import {conexao} from '../conexao.js'

async function editarParcialmenteEndereco(id_endereco, campo, valor){
    const colunasPermitidas = ['logradouro', 'numero', 'cep', 'cidade']
    if (!colunasPermitidas.includes(campo)) return 'Coluna inválida'

    const sql = `UPDATE Endereco SET ${campo} = ? WHERE id_endereco = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [valor, id_endereco]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarParcialmenteEndereco}