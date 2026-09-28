import {conexao} from '../conexao.js'

async function editarParcialmenteLimite(id_limite, campo, valor){
    const colunasPermitidas = ['nome']
    if (!colunasPermitidas.includes(campo)) return 'Coluna inválida'

    const sql = `UPDATE LimiteDeCredito SET ${campo} = ? WHERE id_limite = ?`
    const conn = await conexao()
    try {
        const [results] = await conn.query(sql, [valor, id_limite]);
        return results
    } catch (err) {
        return err.message
    } finally {
        await conn.end()
    }
}

export {editarParcialmenteLimite}