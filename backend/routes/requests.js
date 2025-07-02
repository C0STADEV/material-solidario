const express = require('express');
const router = express.Router();
const db = require('../database');

// Criar solicitação
router.post('/', (req, res) => {
    const { nome_criancas, quantidade, serie, ciente, materiais } = req.body;
    const materiaisStr = typeof materiais === 'string' ? materiais : JSON.stringify(materiais);
    
    const sql = `INSERT INTO requests (user_id, nome_criancas, quantidade, serie, ciente, materiais, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [req.userId, nome_criancas, quantidade, serie, ciente, materiaisStr, 'pendente'], function(err) {
        if (err) {
            console.error('Erro ao registrar solicitação:', err);
            return res.status(500).json({ error: 'Erro ao registrar solicitação' });
        }
        res.json({ 
            id: this.lastID,
            message: 'Solicitação registrada com sucesso'
        });
    });
});

// Obter solicitações do usuário
router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // Verificar se o usuário está acessando suas próprias solicitações
    if (parseInt(userId) !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    
    db.all('SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, requests) => {
        if (err) {
            console.error('Erro ao buscar solicitações:', err);
            return res.status(500).json({ error: 'Erro ao buscar solicitações' });
        }
        
        // Parse os materiais de volta para array
        const requestsWithParsedMaterials = requests.map(req => ({
            ...req,
            materiais: JSON.parse(req.materiais || '[]')
        }));
        
        res.json(requestsWithParsedMaterials);
    });
});

// Atualizar status da solicitação (futuro - para admin)
router.put('/:id/status', (req, res) => {
    // Por enquanto, retornar erro - implementar autenticação de admin no futuro
    res.status(403).json({ error: 'Acesso restrito' });
});

module.exports = router;