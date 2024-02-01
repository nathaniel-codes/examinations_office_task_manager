const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'module_task_db'
});

connection.connect(error => {
    if (error) throw error;
    console.log('Connected to the database');
});

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    connection.query('SELECT modules.*, GROUP_CONCAT(users.username SEPARATOR ", ") AS master_names, GROUP_CONCAT(users.id SEPARATOR ",") AS master_ids FROM modules LEFT JOIN module_masters ON modules.id = module_masters.module_id LEFT JOIN users ON module_masters.user_id = users.id GROUP BY modules.id', (error, modules) => {
        if (error) throw error;
        connection.query('SELECT * FROM users', (error, users) => {
            if (error) throw error;
            connection.query('SELECT tasks.*, modules.title AS module_title, GROUP_CONCAT(users.username SEPARATOR ", ") AS assigned_to FROM tasks JOIN modules ON tasks.module_id = modules.id LEFT JOIN task_assignees ON tasks.id = task_assignees.task_id LEFT JOIN users ON task_assignees.user_id = users.id GROUP BY tasks.id', (error, tasks) => {
                if (error) throw error;
                res.render('index', { modules, users, tasks });
            });
        });
    });
});

app.post('/assigntask', (req, res) => {
    const { description, module_id, master_choice } = req.body;
    connection.query('INSERT INTO tasks (description, module_id) VALUES (?, ?)', [description, module_id], (error, results) => {
        if (error) throw error;
        const taskId = results.insertId;
        if (master_choice === 'all') {
            // Assign task to all masters of the module
            connection.query('INSERT INTO task_assignees (task_id, user_id) SELECT ?, user_id FROM module_masters WHERE module_id = ?', [taskId, module_id], error => {
                if (error) throw error;
                res.redirect('/');
            });
        } else {
            // Assign task to the selected master
            connection.query('INSERT INTO task_assignees (task_id, user_id) VALUES (?, ?)', [taskId, master_choice], error => {
                if (error) throw error;
                res.redirect('/');
            });
        }
    });
});

app.post('/markcomplete', (req, res) => {
    const { task_id } = req.body;
    connection.query('UPDATE tasks SET is_complete = TRUE WHERE id = ?', [task_id], error => {
        if (error) throw error;
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
