const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = 'sua_chave_secreta_aqui';

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userType = decoded.type;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

// Registro de usuário (sem autenticação)
router.post('/register', async (req, res) => {
    try {
        const { type, nome, email, password, telefone, cidade, endereco, bairro } = req.body;
        
        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = `INSERT INTO users (type, nome, email, password, telefone, cidade, endereco, bairro) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.run(sql, [type, nome, email, hashedPassword, telefone, cidade || '', endereco || '', bairro || ''], function(err) {
            if (err) {
                console.error('Erro ao registrar:', err);
                return res.status(400).json({ error: 'Email já cadastrado' });
            }
            
            const token = jwt.sign({ id: this.lastID, type }, JWT_SECRET);
            res.json({ 
                token, 
                user: { 
                    id: this.lastID, 
                    nome, 
                    email, 
                    type,
                    telefone,
                    cidade
                } 
            });
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

// Login (sem autenticação)
router.post('/login', (req, res) => {
    const { email, password, type } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ? AND type = ?', [email, type], async (err, user) => {
        if (err) {
            console.error('Erro no login:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        const token = jwt.sign({ id: user.id, type: user.type }, JWT_SECRET);
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                nome: user.nome, 
                email: user.email, 
                type: user.type,
                telefone: user.telefone,
                cidade: user.cidade 
            } 
        });
    });
});

// Exportar o middleware para uso em outras rotas
module.exports = { router, authMiddleware };