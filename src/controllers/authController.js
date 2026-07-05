require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require ('../config/db');

//Metodo de registro
const register = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        //Validacion
        if(!name || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios'});
        }

        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        //Verifico
        if(existingUsers.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        //Encripta
        const hashedPassword = await bcrypt.hash(password, 10);

        //Nuevo usuario
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        //Genera Token JWT
        const token = jwt.sign( 
            {id: result.insertId, email },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'Inicio de Usuario',
            token,
            user: {
                id: result.insertId,
                name,
                email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno'})
    }
};

//Metodo de Logeo
const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        //Validacion de campo
        if(!email || !password)
        {
            return res.status(400).json({error: 'Email y Contraseña son OBLIGATORIAS'});
        }

        //Buscar usuario por email
        const[ users ] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if(users.length === 0){
            return res.status(401).json({error: 'Credencial invalida'});
        }

        const user = users[0];

        //Verifica la password
        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            return res.status(401).json({error: 'Credencial invalida'});
        }

        //Genera Token JWT
        const token = jwt.sign( 
            {id: user.id, email: user.email },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: 'Iniciando',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno 2'})
    }
};

module.exports = { register, login };