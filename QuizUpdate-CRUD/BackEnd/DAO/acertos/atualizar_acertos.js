import { conexao } from '../../conexao.js'
import { buscarAcerto } from './buscar_acertos.js'
import { listarRespostasDaTentativa } from '../respostas/buscar_respostas.js'
import { atualizarResposta } from '../respostas/atualizar_respostas.js'

// Recalcula a nota da tentativa a partir das respostas gravadas (usar depois de editar respostas)
async function recalcularAcertos(db, codAcerto) {
    const sql = `UPDATE tb_Acertos
                    SET AcertosUsuario = (SELECT COUNT(*) FROM tb_Respostas
                                           WHERE codAcerto = ? AND acertou = 1)
                  WHERE codAcerto = ?`
    const [results] = await db.execute(sql, [codAcerto, codAcerto])
    return results.affectedRows
}

/*
Corrige as respostas de uma tentativa inteira, em transação:
 atualiza cada questão -> recalcula a nota -> confirma. Se algo falhar, nada é gravado.
 "novas" é um array de letras ('A'..'D') ou null, na ordem das questões.
 Devolve a tentativa já atualizada (com as respostas) ou null se ela não existir.
 */
async function atualizarTentativa(codAcerto, novas) {
    const pool = await conexao()
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()

        if (!(await buscarAcerto(conn, codAcerto))) {
            await conn.rollback()
            return null
        }

        const atuais = await listarRespostasDaTentativa(conn, codAcerto)
        for (const r of atuais) {
            await atualizarResposta(conn, codAcerto, r.numeroQuestao, novas[r.numeroQuestao - 1] ?? null)
        }
        await recalcularAcertos(conn, codAcerto)

        await conn.commit()
    } catch (erro) {
        await conn.rollback()
        throw erro
    } finally {
        conn.release()
    }

    const acerto = await buscarAcerto(pool, codAcerto)
    return { ...acerto, respostas: await listarRespostasDaTentativa(pool, codAcerto) }
}

export { atualizarTentativa, recalcularAcertos }
