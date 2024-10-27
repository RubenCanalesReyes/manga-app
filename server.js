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
        const { title } = req.body;
        // Usar el título del manga como nombre del archivo, reemplazando espacios por guiones bajos
        const fixedFileName = `${title.replace(/\s+/g, '_')}.jpg`; // Cambia la extensión según el tipo de imagen
        cb(null, fixedFileName); // Guardar la imagen con el nombre fijo
    }
});

const upload = multer({ storage });

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta public

// Endpoint para agregar un nuevo manga con portada
app.post('/api/add-manga', upload.single('cover'), (req, res) => {
    const { title, description } = req.body;

    // Ruta de la carpeta donde se guardó el manga
    const mangaFolder = path.join(__dirname, 'mangas', title);
    
    // Guardar la descripción en un archivo dentro de la nueva carpeta
    fs.writeFile(path.join(mangaFolder, 'description.txt'), description, (err) => {
        if (err) {
            return res.status(500).send('Error al guardar la descripción');
        }
        res.status(200).send('Manga agregado con éxito');
    });
});

// Endpoint para obtener la lista de mangas
app.get('/api/get-mangas', (req, res) => {
    const mangasDir = path.join(__dirname, 'mangas');
    fs.readdir(mangasDir, { withFileTypes: true }, (err, folders) => {
        if (err) {
            return res.status(500).send('Error al leer la carpeta de mangas');
        }

        const mangas = folders
            .filter(folder => folder.isDirectory())
            .map(folder => {
                const mangaTitle = folder.name;
                const coverPath = path.join(mangasDir, mangaTitle);
                const coverFiles = fs.readdirSync(coverPath).filter(file => file.endsWith('.jpg'));

                return {
                    title: mangaTitle,
                    cover: coverFiles[0] // Suponiendo que solo hay una portada
                };
            });

        res.json(mangas);
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
