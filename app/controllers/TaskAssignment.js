const express = require("express");
const Task = require("../models/Task")
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware')
const roles = require('../constants/roles');
const User = require("../models/user")

module.exports = function (app) {
    const apiRoutes = express.Router()


    apiRoutes.post("/assign", verifyToken, authorizeRoles(roles.ADMIN), async (req, res) => {
        const { id, assignedTo } = req.body;
        console.log(req.body, "Request Body");
    
        try {
            const task = await Task.findByPk(id);
            if (!task) return res.status(404).json({ error: 'Task not found' });
    
            const user = await User.findByPk(assignedTo);
            if (!user) return res.status(404).json({ error: 'User not found' });
    
            task.assignedTo = assignedTo;
            await task.save();
    
            res.json({ message: 'Task assigned successfully', task }); 
        } catch (error) {
            console.error("Error assigning task:", error.message);
            res.status(500).json({ error: 'Error assigning task', details: error.message });
        }

    });




    apiRoutes.put("/tasks/:id", verifyToken, authorizeRoles(roles.MANAGER), async (req, res) => {
        const { id } = req.params;
        const { assignedTo } = req.body;
    
        try {
            const task = await Task.findByPk(id);
            if (!task) return res.status(404).json({ error: 'Task not found' });
    
            const user = await User.findByPk(assignedTo);
            if (!user) return res.status(404).json({ error: 'User not found' });
    
            task.assignedTo = assignedTo;
            await task.save();
    
            res.json({ message: 'Task assignment updated successfully', task });
        } catch (error) {
            console.error("Error updating task assignment:", error.message);
            res.status(500).json({ error: 'Error updating task assignment', details: error.message });
        }
    });





    app.use("/", apiRoutes)
}