const express = require("express");
const Task = require("../models/Task")
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware')
const roles = require('../constants/roles');
// const { where } = require("sequelize");


module.exports = function (app) {

    const apiRoutes = express.Router()


    apiRoutes.post('/createTask', verifyToken, authorizeRoles(roles.ADMIN, roles.MANAGER, roles.USER), async (req, res) => {
        const { title, description, dueDate, priority } = req.body;
        const createdBy = req.user.id;

        try {
            const task = await Task.create({ title, description, dueDate, priority, createdBy });
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ error: 'Error creating task', details: error.message });
        }
    });


    apiRoutes.get('/getTasks', verifyToken, authorizeRoles(roles.ADMIN, roles.MANAGER), async (req, res) => {
        try {
            const tasks = await Task.findAll();
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching tasks', details: error.message });
        }
    });


    apiRoutes.get("/getTasks/:id", verifyToken, authorizeRoles(roles.ADMIN, roles.MANAGER), async (req, res) => {
        try {
            var id = req.params.id
            const getData = await Task.findOne({ where: { id } })
            res.status(200).send(getData)

        } catch (error) {
            res.status(400).send(error.message)

        }

    })




    apiRoutes.post('/updateTask/:id', verifyToken, authorizeRoles(roles.ADMIN, roles.MANAGER), async (req, res) => {
        const id = req.params.id;
        const { title, description, dueDate, priority, userId } = req.body;

        try {
            const task = await Task.findOne({ where: { id } });
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }

            await Task.update(
                { title, description, dueDate, priority, userId },
                { where: { id } }
            );

            const updatedTask = await Task.findOne({ where: { id } });
            res.json({ message: 'Task updated successfully', task: updatedTask });

        } catch (error) {
            res.status(500).json({ error: 'Error updating task', details: error.message });
        }
    });




    apiRoutes.post('/deleteTask/:id', verifyToken, authorizeRoles(roles.ADMIN, roles.MANAGER), async (req, res) => {
        const id = req.params.id;

        try {
            // Check if task exists
            const task = await Task.findOne({ where: { id } });
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }

            // Delete the task
            await Task.destroy({ where: { id } });

            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting task', details: error.message });
        }
    });


    // console.log(roles.USER , "hii")

    // apiRoutes.post('/createTask', verifyToken,authorizeRoles(roles), async (req, res) => {
    //         // console.log(roles.USER,req.role);

    //     // if(!(roles.USER === req.role)){
    //     //     return res.status(403).json({ error: 'Sorry, you do not have access to this route' });
    //     // }
    //     const { title, description, dueDate, priority } = req.body;
    //     const userId = req.userId;
    //     console.log("Request body:", req.body);

    //     try {
    //         const task = await Task.create({ title, description, dueDate, priority, userId });
    //         res.status(201).json(task);
    //     } catch (error) {
    //         res.status(500).json({ error: 'Error creating task', details: error });
    //     }
    // });

    // apiRoutes.post('/createTask', verifyToken, authorizeRoles(roles), async (req, res) => {
    //     const { title, description, dueDate, priority, userId } = req.body;
    //     console.log(req.body)
    //     try {
    //         const task = await Task.create({ title, description, dueDate, priority, userId });
    //         res.status(201).json(task);
    //     } catch (error) {
    //         res.status(500).json({ error: 'Error creating task', details: error });
    //     }
    // });






    app.use('/', apiRoutes)
}

