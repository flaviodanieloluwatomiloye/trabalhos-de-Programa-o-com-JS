import mysql from "mysql2/promise"

// O pool é criado UMA vez só, aqui fora da função, e todas as consultas reaproveitam o mesmo.
const pool = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "OLFADATO1.a@",
    database: "bd_quiz"
})

async function conexao() {
    return pool
}

async function closeConexao() {
    console.log("Fechando a conexão com o banco de dados")
    await pool.end()
}

async function testarConexao() {
    try {
        const conn = await pool.getConnection()
        await conn.ping()
        console.log("✅ Conexão com o MySQL bem-sucedida!")
        conn.release()
    } catch (erro) {
        console.error("❌ Falha ao conectar com o MySQL:", erro.message)
    }
}

export { conexao, closeConexao, testarConexao }