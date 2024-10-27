const mangas = []; // Almacenará los mangas agregados
const mangaList = document.getElementById("manga-list");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const addMangaBtn = document.getElementById("add-manga-btn");
const submitManga = document.getElementById("submit-manga");
const mangaTitleInput = document.getElementById("manga-title");
const mangaDescriptionInput = document.getElementById("manga-description");
const coverInput = document.getElementById("manga-cover");

// Función para mostrar los mangas en la lista
function displayMangas() {
    mangaList.innerHTML = '';
    mangas.forEach(manga => {
        const mangaItem = document.createElement("div");
        mangaItem.className = "manga-item";
        mangaItem.innerHTML = `
            <h3>${manga.title}</h3>
            <img src="mangas/${manga.title}/${manga.cover}" alt="${manga.title} Cover" class="cover-image">
            <p>${manga.description}</p>
        `;
        mangaList.appendChild(mangaItem);
    });
}

// Evento para mostrar el modal
addMangaBtn.onclick = function() {
    modal.style.display = "block";
}

// Evento para cerrar el modal
closeModal.onclick = function() {
    modal.style.display = "none";
}

// Evento para agregar un nuevo manga
submitManga.onclick = async function() {
    const title = mangaTitleInput.value;
    const description = mangaDescriptionInput.value;
    const coverFile = coverInput.files[0];

    // Crear un FormData para enviar datos y archivo
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('cover', coverFile); // Agregar la portada

    // Enviar datos al servidor
    try {
        const response = await fetch('/api/add-manga', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            mangas.push({ title, description, cover: coverFile.name });
            displayMangas();
            mangaTitleInput.value = '';
            mangaDescriptionInput.value = '';
            coverInput.value = ''; // Limpiar el campo de archivo
            modal.style.display = "none";
            alert('Manga agregado con éxito');
        } else {
            alert('Error al agregar el manga');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al comunicarse con el servidor');
    }
}
