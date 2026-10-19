/*
Troca a resposta marcada numa questão e já recalcula o "acertou" comparando com a correta
que está gravada na própria linha. "resposta" = 'A'..'D' ou null (não respondida).
Depois de atualizar as questões, chame recalcularAcertos() para acertar a nota.
 */
async function atualizarResposta(db, codAcerto, numeroQuestao, resposta) {
    const sql = `UPDATE tb_Respostas
                    SET respostaUsuario = ?,
                        acertou = COALESCE(respostaCorreta = ?, 0)
                  WHERE codAcerto = ? AND numeroQuestao = ?`
    const [results] = await db.execute(sql, [resposta, resposta, codAcerto, numeroQuestao])
    return results.affectedRows
}

export { atualizarResposta }
