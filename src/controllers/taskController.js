require('dotenv').config();
const pool = require('../config/db');

//Metodo de crear tareas
const createTask = async(req, res) => {
    try{
        const { title, description, status } = req.body;

        if(!title){
            return res.status(400).json ({ error: 'No existe el titulo'});
        }

        const user_id = req.user.id;

        const [result] = await pool.query(
            'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)',
            [ user_id, title, description ]
        );

        res.status(201).json({
            message: ' Tarea Creado ',
            user_id,
            task: {
                id: result.insertId,
                title,
                description
            }

        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno 3'})
    }
};

//Metodo para asignar tareas
const getTasks = async(req, res) => {
    try{

        const user_id = req.user.id;

        const[result] = await pool.query(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
            [user_id]
        );

        res.status(200).json({
            message: ' Tus Tareas ',
            user_id,
            tasks: result
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno 4'})
    }
};

//Metodo para mostrar las tareas del usuario
const getTaskById = async(req, res) => {
    try{
        const task_id = req.params.id;

        const user_id = req.user.id;

        const [ result ] = await pool.query(
            'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
            [ task_id, user_id ]
        );

        if(result.length === 0) {
            return res.status(404).json({ error: 'El usuario no tiene tareas'})
        }
        
        res.status(200).json({
            message: 'Tareas del usuario',
            task: result[0]
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno 5'})
    }
};

//Metodo para actualizar las tareas
const updateTask = async(req, res) => {
    try{

        const { title, description, status } = req.body;
        
        const task_id = req.params.id;

        const user_id = req.user.id;

        const [ result ] = await pool.query(
            'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
            [ task_id, user_id ]
        );

        if(result.length === 0) {
            return res.status(404).json({ error: 'El usuario no tiene tareas'})
        };

        const [ resultUpdate ] = await pool.query(
            'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
            [ title, description, status, task_id, user_id ]
        );

        res.status(200).json({
            message: 'El usuario actualizo la tarea',
            task: {
                id: task_id,
                title,
                description,
                status,
                user_id
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno 6'})
    }
};

//Metodo DELETE
const deleteTask = async(req, res) => {
    try{
        const task_id = req.params.id;
        const user_id = req.user.id;

        const [ result ] = await pool.query(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [ task_id, user_id ]
        )

        if(result.affectedRows === 0){
            return res.status(404).json({ error: 'Tarea no encontrada'})
        }

        res.status(204).send();

    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error interno'});
        }   
};
 module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };