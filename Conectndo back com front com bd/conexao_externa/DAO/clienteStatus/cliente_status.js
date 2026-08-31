import { conexao } from '../conexao.js'

async function buscarClienteStatus() {
    console.log('DAO de CLIENTE_STATUS (VIEW)')
    const sql = `SELECT * FROM vw_cliente_status;`

    const conn = await conexao()
    try {
        const [rows] = await conn.query(sql)
        await conn.end()
        return rows
    } catch (err) {
        return err.message
    }
}

export { buscarClienteStatus }