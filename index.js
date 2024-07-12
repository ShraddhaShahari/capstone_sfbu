const express = require('express');
const path = require('path');

const app = express();

// Serving static files (like CSS, images, etc.)
app.use(express.static(path.join(__dirname)));

// Serving HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});