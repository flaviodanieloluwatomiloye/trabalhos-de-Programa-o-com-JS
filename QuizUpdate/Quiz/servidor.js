const express = require('express');
const fs = require('fs');
 
const app = express();
 
app.use(express.json());
app.use(express.static(__dirname));
 
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    if (nome.length < 3 || !email.includes('@') || senha.length < 8) return res.sendStatus(400)

    const usuarios = JSON.parse(fs.readFileSync('JSON/bd.json', 'utf8' ) || '[]')
    if (usuarios.some(u => u.email === email)) return res.sendStatus(409)

    usuarios.push({ nome, email, senha })

    fs.writeFileSync('JSON/bd.json', JSON.stringify(usuarios).replaceAll('},{"', '},\n{"'))

    res.end();
})
 
app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000/paginas/index.html'));
 