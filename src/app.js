const express = require('express');
require('dotenv').config();
require('./config/db');

const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);


app.get('/health', (req, res) => {
    res.json({status: 'OK', message: 'task-manager-api Funcionando' });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor Corriendo en http://localhost:${PORT}`);
});

const authMiddleware = require('./middlewares/authMiddleware');

app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Ruta Protegida', user:req.user });
});