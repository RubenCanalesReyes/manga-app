const mangas = []; // Almacenará los mangas agregados
const mangaList = document.getElementById("manga-list");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const addMangaBtn = document.getElementById("add-manga-btn");
const submitManga = document.getElementById("submit-manga");
const mangaTitleInput = document.getElementById("manga-title");
const mangaDescriptionInput = document.getElementById("manga-description");

// Función para mostrar los mangas en la lista
function displayMangas() {
    mangaList.innerHTML = '';
    mangas.forEach(manga => {
        const mangaItem = document.createElement("div");
        mangaItem.className = "manga-item";
        mangaItem.innerHTML = `
            <h3>${manga.title}</h3>
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

    // Enviar datos al servidor
    try {
        const response = await fetch('/api/add-manga', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        });

        if (response.ok) {
            // Actualizar la lista de mangas
            mangas.push({ title, description });
            displayMangas();
            mangaTitleInput.value = '';
            mangaDescriptionInput.value = '';
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

// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
