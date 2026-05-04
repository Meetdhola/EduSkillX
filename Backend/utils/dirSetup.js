const fs = require('fs');
const path = require('path');

// Ensure required directories exist
const setupDirectories = () => {
    const dirs = [
        path.join(__dirname, '../uploads'),
        path.join(__dirname, '../uploads/avatars'),
        path.join(__dirname, '../uploads/transcriptions')
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            console.log(`Creating directory: ${dir}`);
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

module.exports = setupDirectories; 