import {conexao} from '../conexao.js'

async function deletarProduto(codigo){
    
    const sql = `DELETE FROM Produto WHERE id_produto = ?`
    const conn = await conexao()
    
    try {
        // Executar a consulta
        const [results] = await conn.query(sql,[codigo]);

        await conn.end()
        return results
      } catch (err) {
        return err.message
      }
}

export {deletarProduto}
