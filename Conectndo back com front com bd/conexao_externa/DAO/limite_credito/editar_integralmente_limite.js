import {conexao} from '../conexao.js'

async function editarIntegralmenteLimite(id_limite, infos){
    const sql = `UPDATE LimiteDeCredito SET nome = ? WHERE id_limite = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [...infos, id_limite]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarIntegralmenteLimite}