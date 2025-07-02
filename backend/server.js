const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { router: authRoutes, authMiddleware } = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const requestRoutes = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Aplicar authMiddleware apenas nas rotas protegidas
app.use('/api/donations', authMiddleware, donationRoutes);
app.use('/api/requests', authMiddleware, requestRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'API de Doação de Materiais Escolares' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Start server only if not in production (for Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;