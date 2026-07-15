require('dotenv').config();
const pool = require('../config/db');
const { param } = require('../routes/authRoutes');
const VALID_STATUSES = ['pending', 'in_progress', 'completed'];

//Metodo de crear tareas
const createTask = async(req, res) => {
    try{
        const { title, description, status } = req.body;

        if(!title){
            return res.status(400).json ({ error: 'Se necesitas un titulo'});
        }

        const titleMod = title.trim();

        if(!titleMod){
            return res.status(400).json ({ error: 'Titulo vacío'});
        }

        if(status != null){
            if(VALID_STATUSES.indexOf(status) == -1){
                return res.status(400).json ({ error: 'No existe, comandos: pending, in_progress, completed'});
            }
        }
        const user_id = req.user.id;

        const [result] = await pool.query(
            'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
            [ user_id, titleMod, description, status ]
        );

        res.status(201).json({
            message: ' Tarea Creado ',
            user_id,
            task: {
                id: result.insertId,
                title: titleMod,
                description,
                status
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

        const { status, page, limit } = req.query;

        const pageNum = Number(page) || 1;

        const limitNum = Number(limit) || 10;


        const offset = (pageNum - 1) * limitNum;

        let query = 'SELECT * FROM tasks WHERE user_id = ?';
        let params = [user_id];

        if(status != null){
            if(VALID_STATUSES.indexOf(status) == -1){
                return res.status(400).json ({ error: "El estado es invalido, corrige a: pending, in_progress, completed"});
            }
            else{
                query += '  AND status = ?';
                params.push(status);
            }
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limitNum, pageNum);

        const [ result ] = await pool.query(query, params);

        res.status(200).json({
            message: 'Tus tareas',
            page: pageNum,
            limit: limitNum,
            tasks: result
        });
        
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

        const existingTask = result[0];

        let finalTitle = existingTask.title;
        if(title != null){
            const titleMod = title.trim();
            if(!titleMod){
                return res.status(400).json({ error: 'Titulo Invalido' });
            }
            finalTitle = titleMod;
        }

        let finalStatus = existingTask.status;
        if(status != null){
            if(VALID_STATUSES.indexOf(status) == -1){
                return res.status(400).json({ error: "Status invalida, corrige a: pending, in_progress, completed" });
            }
            finalStatus = status;
        }

        const finalDescription = description != null ? description : existingTask.description;

        const [ resultUpdate ] = await pool.query(
            'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
            [ finalTitle, finalDescription, finalStatus, task_id, user_id ]
        );

        res.status(200).json({
            message: 'El usuario actualizo la tarea',
            task: {
                id: task_id,
                title: finalTitle,
                description: finalDescription,
                status: finalStatus,
                user_id
            }
        });



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno 6'});
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
//Metodo Complete
const completeTask = async(req, res) => {
    try{

        const task_id = req.params.id;
        const user_id = req.user.id;
        const completed = VALID_STATUSES[2];

        const [ result ] = await pool.query(
            'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
            [ task_id, user_id ]
        );

        if(result.length === 0){
            return res.status(404).json({ error: 'No existe la tarea'})
        };

        const [ resultUpdate ] = await pool.query(
            'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
            [ completed, task_id, user_id ]
        );


        res.status(200).json({
            message: 'Tarea Actualizada',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno 7'});
    }
};
module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, completeTask };