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
    const itemsArray = JSON.parse(items);
    itemsArray.forEach(item => {
        total += pointsMap[item] || 0;
    });
    return total;
}

// Criar doação
router.post('/', (req, res) => {
    const { doou_antes, items, data_entrega, cras } = req.body;
    const points = calculatePoints(JSON.stringify(items));
    
    const sql = `INSERT INTO donations (user_id, doou_antes, items, data_entrega, cras, points) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [req.userId, doou_antes, JSON.stringify(items), data_entrega, cras, points], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao registrar doação' });
        }
        res.json({ id: this.lastID, points });
    });
});

// Obter doações do usuário
router.get('/user/:userId', (req, res) => {
    db.all('SELECT * FROM donations WHERE user_id = ?', [req.params.userId], (err, donations) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar doações' });
        }
        
        let totalPoints = 0;
        donations.forEach(donation => {
            totalPoints += donation.points;
        });
        
        res.json({ donations, totalPoints });
    });
});

module.exports = router;