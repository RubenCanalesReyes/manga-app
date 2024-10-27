const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Configurar multer para almacenar las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { title } = req.body;
        const mangaFolder = path.join(__dirname, 'mangas', title);
        fs.mkdir(mangaFolder, { recursive: true }, (err) => {
            cb(null, mangaFolder); // Guardar en la carpeta del manga
        });
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Usar el nombre original del archivo
    }
});

const upload = multer({ storage });

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta public

// Endpoint para agregar un nuevo manga con portada
app.post('/api/add-manga', upload.single('cover'), (req, res) => {
    const { title, description } = req.body;

    // Guardar la descripción en un archivo dentro de la nueva carpeta
    const mangaFolder = path.join(__dirname, 'mangas', title);
    fs.writeFile(path.join(mangaFolder, 'description.txt'), description, (err) => {
        if (err) {
            return res.status(500).send('Error al guardar la descripción');
        }
        res.status(200).send('Manga agregado con éxito');
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
