// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');  // Importa a conexão do banco de dados

const app = express();
const port = 3000;

// Permite requisições de diferentes origens (CORS)
app.use(cors());
app.use(express.static('public')); // Serve arquivos estáticos (seu front-end)

// Rota para buscar as distâncias do banco de dados
app.get('/api/distances', (req, res) => {
  const query = 'SELECT * FROM distances ORDER BY created_at DESC LIMIT 2'; // Pega os 2 registros mais recentes

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar distâncias:', err);
      return res.status(500).send('Erro ao buscar distâncias');
    }

    res.json(results);  // Retorna os dados como JSON
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
