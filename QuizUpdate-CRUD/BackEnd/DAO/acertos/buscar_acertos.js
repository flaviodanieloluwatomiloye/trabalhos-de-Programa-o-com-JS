// Todas as tentativas, já com o nome/e-mail de quem jogou (mais recentes primeiro)
async function listarAcertos(db) {
    const sql = `SELECT a.codAcerto, a.codUsuario, u.nomeUsuario, u.emailUsuario,
                        a.AcertosUsuario, a.totalQuestoes, a.dataQuiz
                   FROM tb_Acertos a
                   JOIN tb_Usuario u ON u.codUsuario = a.codUsuario
                  ORDER BY a.dataQuiz DESC, a.codAcerto DESC`
    const [linhas] = await db.execute(sql)
    return linhas
}

async function buscarAcerto(db, codAcerto) {
    const sql = `SELECT a.codAcerto, a.codUsuario, u.nomeUsuario, u.emailUsuario,
                        a.AcertosUsuario, a.totalQuestoes, a.dataQuiz
                   FROM tb_Acertos a
                   JOIN tb_Usuario u ON u.codUsuario = a.codUsuario
                  WHERE a.codAcerto = ?`
    const [linhas] = await db.execute(sql, [codAcerto])
    return linhas[0] ?? null
}

// Lista as tentativas de um usuário, da mais recente para a mais antiga
async function listarAcertosDoUsuario(db, codUsuario) {
    const sql = `SELECT codAcerto, AcertosUsuario, totalQuestoes, dataQuiz
                   FROM tb_Acertos
                  WHERE codUsuario = ?
                  ORDER BY dataQuiz DESC`
    const [linhas] = await db.execute(sql, [codUsuario])
    return linhas
}

export { listarAcertos, buscarAcerto, listarAcertosDoUsuario }
