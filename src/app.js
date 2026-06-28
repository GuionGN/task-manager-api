const express = require('express');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({status: 'OK', message: 'task-manager-api Funcionando' });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor Corriendo en http://localhost:${PORT}`);
});