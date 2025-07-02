const express = require('express');
const router = express.Router();
const db = require('../database');

// Criar solicitação
router.post('/', (req, res) => {
    const { nome_criancas, quantidade, serie, ciente, materiais } = req.body;
    
    const sql = `INSERT INTO requests (user_id, nome_criancas, quantidade, serie, ciente, materiais) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [req.userId, nome_criancas, quantidade, serie, ciente, JSON.stringify(materiais)], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao registrar solicitação' });
        }
        res.json({ id: this.lastID });
    });
});

// Obter solicitações do usuário
router.get('/user/:userId', (req, res) => {
    db.all('SELECT * FROM requests WHERE user_id = ?', [req.params.userId], (err, requests) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar solicitações' });
        }
        res.json(requests);
    });
});

module.exports = router;