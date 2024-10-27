document.addEventListener("DOMContentLoaded", () => {
    const filterInput = document.getElementById('filterInput');
    const mangaList = document.getElementById('mangaList');
    const addMangaModal = document.getElementById('addMangaModal');
    const closeModal = document.querySelector('.close');
    const addMangaBtn = document.getElementById('addMangaBtn');
    const mangaForm = document.getElementById('mangaForm');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    // Supongamos que tienes una lista de mangas vacía inicialmente
    let mangas = [];

    // Función para mostrar mangas
    function showMangas(mangasToShow) {
        mangaList.innerHTML = ''; // Limpiar la lista
        mangasToShow.forEach(manga => {
            const mangaItem = document.createElement('div');
            mangaItem.className = 'manga-item';
            mangaItem.innerHTML = `
                <h3>${manga.title}</h3>
                <img class="cover-image" src="${manga.cover}" alt="${manga.title}">
                <p>${manga.description}</p>
            `;
            mangaList.appendChild(mangaItem);
        });
    }

    // Mostrar todos los mangas al cargar
    showMangas(mangas);

    // Filtrar mangas por nombre
    filterInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const filteredMangas = mangas.filter(manga => manga.title.toLowerCase().includes(query));
        showMangas(filteredMangas);
    });

    // Función para abrir el modal
    addMangaBtn.addEventListener('click', () => {
        addMangaModal.style.display = 'block';
    });

    // Función para cerrar el modal
    closeModal.addEventListener('click', () => {
        addMangaModal.style.display = 'none';
    });

    // Cerrar el modal si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === addMangaModal) {
            addMangaModal.style.display = 'none';
        }
    });

    // Manejar el envío del formulario
    mangaForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const coverInput = document.getElementById('cover');

        // Generar un nombre de archivo único para la portada
        const coverFile = coverInput.files[0];
        const coverName = `${title.replace(/\s+/g, '_').toLowerCase()}.jpg`; // Cambiar espacios por guiones bajos y a minúsculas

        // Crear un objeto de manga
        const newManga = {
            title,
            description,
            cover: URL.createObjectURL(coverFile) // Crea un URL temporal para mostrar la imagen
        };

        // Agregar el nuevo manga a la lista
        mangas.push(newManga);

        // Limpiar el formulario y cerrar el modal
        mangaForm.reset();
        addMangaModal.style.display = 'none';

        // Mostrar la lista actualizada de mangas
        showMangas(mangas);
    });

    // Cambiar el tema claro/oscuro
    let darkMode = false;
    themeToggleBtn.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        themeToggleBtn.textContent = darkMode ? 'Cambiar a Claro' : 'Cambiar a Oscuro';
    });
});
