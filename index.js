import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mysql from 'mysql2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
const PORT = process.env.PORT || 8000;

const conn = mysql.createConnection({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'exercise_m06_241111987',
    port: process.env.MYSQLPORT || 3306
});

conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});

app.use(express.static('public'));

app.get('/quotes', (req, res) => {
    res.sendFile(__dirname + '/public/quotes.html');
});

app.get('/api/quotes', (req, res) => {
    const sql = 'SELECT * FROM quotes';

    conn.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Gagal mengambil data quotes' });
        }

        const shuffled = results.sort(() => 0.5 - Math.random());
        const randomQuotes = shuffled.slice(0, 9);

        res.json(randomQuotes);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at ${HOSTNAME}:${PORT}`);
});
