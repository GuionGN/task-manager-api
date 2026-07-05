const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    try{
        // Busca el token en el header Authorization
        const authHeader = req.headers['authorization'];

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ error: 'Token no proporcionado '});
        }

        // Extrae el token (viendo como "Bearer eltoken123")
        const token = authHeader.split(' ')[1];

        // Verifica token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Guarda los datos del usuario en el request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' })
    }
};

module.exports = authMiddleware;