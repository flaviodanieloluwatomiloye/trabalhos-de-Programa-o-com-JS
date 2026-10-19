// Busca o detalhe (questão a questão) de uma tentativa
async function listarRespostasDaTentativa(db, codAcerto) {
    const sql = `SELECT numeroQuestao, respostaUsuario, respostaCorreta, acertou
                   FROM tb_Respostas
                  WHERE codAcerto = ?
                  ORDER BY numeroQuestao`
    const [linhas] = await db.execute(sql, [codAcerto])
    return linhas.map(l => ({ ...l, acertou: Boolean(l.acertou) })) // BOOLEAN do MySQL chega como 0/1
}

export { listarRespostasDaTentativa }
