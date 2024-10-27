const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta public

// Endpoint para agregar un nuevo manga
app.post('/api/add-manga', (req, res) => {
    const { title, description } = req.body;
    const mangaFolder = path.join(__dirname, 'mangas', title);

    // Crear una nueva carpeta para el manga
    fs.mkdir(mangaFolder, { recursive: true }, (err) => {
        if (err) {
            return res.status(500).send('Error al crear la carpeta');
        }
        // Guardar la descripción en un archivo dentro de la nueva carpeta
        fs.writeFile(path.join(mangaFolder, 'description.txt'), description, (err) => {
            if (err) {
                return res.status(500).send('Error al guardar la descripción');
            }
            res.status(200).send('Manga agregado con éxito');
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
