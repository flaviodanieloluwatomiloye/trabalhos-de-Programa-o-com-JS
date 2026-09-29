import {conexao} from '../conexao.js'

async function editarIntegralmenteEndereco(id_endereco, infos){
    const sql = `UPDATE Endereco SET logradouro = ?, numero = ?, cep = ?, cidade = ? WHERE id_endereco = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [...infos, id_endereco]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarIntegralmenteEndereco}