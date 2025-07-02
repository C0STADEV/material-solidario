const express = require('express');
const router = express.Router();
const db = require('../database');

// Calcular pontos
function calculatePoints(items) {
    const pointsMap = {
        'Caderno': 5,
        'Mochilas': 8,
        'Lápis de cor': 4,
        'Canetas': 1,
        'Lápis': 1,
        'Borrachas': 1,
        'Apontadores': 1,
        'Réguas': 2,
        'Estojo': 3
    };
    
    let total = 0;
    const itemsArray = typeof items === 'string' ? JSON.parse(items) : items;
    itemsArray.forEach(item => {
        total += pointsMap[item] || 0;
    });
    return total;
}

// Criar doação
router.post('/', (req, res) => {
    const { doou_antes, items, data_entrega, cras } = req.body;
    const points = calculatePoints(items);
    const itemsStr = typeof items === 'string' ? items : JSON.stringify(items);
    
    const sql = `INSERT INTO donations (user_id, doou_antes, items, data_entrega, cras, points) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [req.userId, doou_antes, itemsStr, data_entrega, cras, points], function(err) {
        if (err) {
            console.error('Erro ao registrar doação:', err);
            return res.status(500).json({ error: 'Erro ao registrar doação' });
        }
        res.json({ id: this.lastID, points });
    });
});

// Obter doações do usuário
router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // Verificar se o usuário está acessando suas próprias doações
    if (parseInt(userId) !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    
    db.all('SELECT * FROM donations WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, donations) => {
        if (err) {
            console.error('Erro ao buscar doações:', err);
            return res.status(500).json({ error: 'Erro ao buscar doações' });
        }
        
        let totalPoints = 0;
        donations.forEach(donation => {
            totalPoints += donation.points || 0;
        });
        
        res.json({ donations, totalPoints });
    });
});

// Obter todas as doações (para admin - futuro)
router.get('/all', (req, res) => {
    // Por enquanto, retornar erro - implementar autenticação de admin no futuro
    res.status(403).json({ error: 'Acesso restrito' });
});

module.exports = router;