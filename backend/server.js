
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Home
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// Backend message
app.get('/api/message', (req, res) => {
    res.json({
        message: 'React connected successfully with Express Backend!'
    });
});

// Database test
app.get('/api/db-test', (req, res) => {
    db.query('SELECT 1 AS result', (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Database connection failed'
            });
        }

        res.json({
            success: true,
            result: results
        });
    });
});

// READ - Get all projects
app.get('/api/projects', (req, res) => {
    db.query('SELECT * FROM projects ORDER BY id DESC', (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Unable to fetch projects'
            });
        }

        res.json({
            success: true,
            projects: results
        });
    });
});

// CREATE - Add project
app.post('/api/projects', (req, res) => {
    const { title, description, technologies, github_link } = req.body;

    if (!title || !description || !technologies) {
        return res.status(400).json({
            success: false,
            message: 'Title, description and technologies are required'
        });
    }

    const sql = `
        INSERT INTO projects
        (title, description, technologies, github_link)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, description, technologies, github_link || ''],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Unable to add project'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Project added successfully!',
                projectId: result.insertId
            });
        }
    );
});

// UPDATE - Edit project
app.put('/api/projects/:id', (req, res) => {
    const { title, description, technologies, github_link } = req.body;
    const { id } = req.params;

    if (!title || !description || !technologies) {
        return res.status(400).json({
            success: false,
            message: 'Title, description and technologies are required'
        });
    }

    const sql = `
        UPDATE projects
        SET title = ?, description = ?, technologies = ?, github_link = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [title, description, technologies, github_link || '', id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Unable to update project'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }

            res.json({
                success: true,
                message: 'Project updated successfully!'
            });
        }
    );
});

// DELETE - Remove project
app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'DELETE FROM projects WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Unable to delete project'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }

            res.json({
                success: true,
                message: 'Project deleted successfully!'
            });
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
