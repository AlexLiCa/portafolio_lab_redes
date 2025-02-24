(function () {
  // Extraer el nombre de la práctica desde la URL (se asume formato: http://dominio/practica1/)
  const pathParts = window.location.pathname
    .split("/")
    .filter((part) => part !== "");
  const practiceFolder = pathParts[0];

  // Cargar el JSON de prácticas (ubicado en la raíz) para título, fecha, resumen y badges
  fetch("../practicas.json")
    .then((response) => response.json())
    .then((data) => {
      const practicas = data.practicas;
      const currentPractice = practicas.find(
        (p) => p.folder === practiceFolder
      );
      if (currentPractice) {
        document.getElementById("practica-title").textContent =
          currentPractice.title;
        document.getElementById("practica-date").textContent =
          "Fecha: " + currentPractice.date;
        // Actualizar el resumen con "description"
        document.getElementById("resumen").innerHTML = `
          <h2 class="fw-bolder mb-4 mt-5 fs-5">- Resumen -</h2>
          <p id="resumen-content" class="fs-6 mb-4">${currentPractice.description}</p>
        `;
        // Generar badges
        const badgesContainer = document.getElementById("practica-badges");
        currentPractice.badges.forEach((badge) => {
          const badgeElement = document.createElement("a");
          badgeElement.className =
            "badge bg-primary text-decoration-none link-light me-1";
          badgeElement.textContent = badge;
          badgesContainer.appendChild(badgeElement);
        });
      } else {
        console.error(
          "No se encontró la práctica para el folder:",
          practiceFolder
        );
      }
    })
    .catch((error) => console.error("Error al cargar practicas.json:", error));

  // Generar la sección de autores utilizando la variable global "autoresGlobales" (definida en autores.js)
  document.addEventListener("DOMContentLoaded", function () {
    const headerAutores = document.getElementById("header-autores");
    if (typeof autoresGlobales !== "undefined") {
      autoresGlobales.forEach((author) => {
        const col = document.createElement("div");
        col.className = "col text-center";
        // Como este archivo está en "practica1", usamos "../" para acceder a "assets" en la raíz
        col.innerHTML = `
          <img class="img-fluid rounded-circle mb-2" width="50" src="../${author.image}" alt="${author.name}">
          <div class="fw-bold">${author.name}</div>
          <div class="text-muted">${author.carrera}</div>
        `;
        headerAutores.appendChild(col);
      });
    } else {
      console.error("La variable autoresGlobales no está definida.");
    }
  });

  // Cargar el contenido específico desde "Configuration.json" (ubicado en la carpeta de la práctica)
  fetch("Configuration.json")
    .then((response) => response.json())
    .then((data) => {
      // Actualizar las secciones generales del contenido específico:
      if (data.general) {
        document.getElementById("intro").innerHTML = `
          <h2 class="fw-bolder mb-4 mt-5 fs-5">- Introducción -</h2>
          <p class="fs-6 mb-4">${data.general.introduccion}</p>
        `;
        document.getElementById("materiales").innerHTML = `
          <h2 class="fw-bolder mb-4 mt-5 fs-5">- Materiales -</h2>
          <p class="fs-6 mb-4">${data.general.materiales}</p>
        `;
        document.getElementById("desarrollo").innerHTML = `
          <h2 class="fw-bolder mb-4 mt-5 fs-5">- Desarrollo -</h2>
          <p class="fs-6 mb-4">${data.general.desarrollo}</p>
        `;
        document.getElementById("conclusiones").innerHTML = `
          <h2 class="fw-bolder mb-4 mt-5 fs-5">- Conclusiones -</h2>
          <p class="fs-6 mb-4">${data.general.conclusiones}</p>
        `;
      }

      // Generar los slides del carrusel (para la sección de Contenido Específico)
      if (data.slides && Array.isArray(data.slides)) {
        const carouselInner = document.getElementById("carousel-inner");
        data.slides.forEach((slide, index) => {
          let slideHTML = "";
          if (slide.type === "image") {
            slideHTML = `
              <img src="${slide.src}" class="d-block w-100" alt="Imagen">
              <div class="carousel-caption d-none d-md-block">
                <p>${slide.description}</p>
              </div>
            `;
          } else if (slide.type === "video") {
            slideHTML = `
              <video class="d-block w-100" controls>
                <source src="${slide.src}" type="video/mp4">
                Tu navegador no soporta el video.
              </video>
              <div class="carousel-caption d-none d-md-block">
                <p>${slide.description}</p>
              </div>
            `;
          } else if (slide.type === "code") {
            slideHTML = `
              <pre style="background:#f5f5f5; padding:1rem; border-radius:4px; overflow-x:auto;">
                <code>${slide.code}</code>
              </pre>
              <div class="carousel-caption d-none d-md-block">
                <p>${slide.description}</p>
              </div>
            `;
          } else if (slide.type === "development") {
            slideHTML = `
              <div class="d-block w-100 p-3" style="background:#f5f5f5; border-radius:4px;">
                <p>${slide.content}</p>
              </div>
              <div class="carousel-caption d-none d-md-block">
                <p>${slide.description}</p>
              </div>
            `;
          }
          const slideDiv = document.createElement("div");
          slideDiv.className = "carousel-item" + (index === 0 ? " active" : "");
          slideDiv.innerHTML = slideHTML;
          carouselInner.appendChild(slideDiv);
        });
      }
    })
    .catch((error) =>
      console.error("Error al cargar Configuration.json:", error)
    );
})();
// Cargar el contenido específico con pestañas desde "Configuration.json"
document.addEventListener("DOMContentLoaded", function () {
  fetch('Configuration.json')
    .then(response => response.json())
    .then(data => {
      if (data.tabs && Array.isArray(data.tabs)) {
        const tabsContainer = document.getElementById('configurationTabs');
        const tabContentContainer = document.getElementById('configurationTabContent');

        data.tabs.forEach((tab, tabIndex) => {
          // Crear el botón de pestaña
          const tabId = 'tab-' + tabIndex;
          const li = document.createElement('li');
          li.className = 'nav-item';
          li.setAttribute('role', 'presentation');
          li.innerHTML = `
            <button class="nav-link ${tabIndex === 0 ? 'active' : ''}" id="${tabId}-tab" data-bs-toggle="tab" data-bs-target="#${tabId}" type="button" role="tab" aria-controls="${tabId}" aria-selected="${tabIndex === 0 ? 'true' : 'false'}">
              ${tab.title}
            </button>
          `;
          tabsContainer.appendChild(li);

          // Crear el contenido de la pestaña
          const tabPane = document.createElement('div');
          tabPane.className = 'tab-pane fade' + (tabIndex === 0 ? ' show active' : '');
          tabPane.id = tabId;
          tabPane.setAttribute('role', 'tabpanel');
          tabPane.setAttribute('aria-labelledby', `${tabId}-tab`);

          // Para cada elemento dentro de "slides" (que puede ser mixto) se genera su contenido:
          let tabHTML = '';
          tab.slides.forEach(slide => {
            if (slide.type === "image") {
              tabHTML += `
                <div class="mb-4">
                  <img src="${slide.src}" class="img-fluid" alt="Imagen">
                  <p class="mt-2 text-center">${slide.description}</p>
                </div>
              `;
            } else if (slide.type === "video") {
              tabHTML += `
                <div class="mb-4">
                  <video class="img-fluid" controls>
                    <source src="${slide.src}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                  </video>
                  <p class="mt-2 text-center">${slide.description}</p>
                </div>
              `;
            } else if (slide.type === "code") {
              tabHTML += `
                <div class="mb-4">
                  <pre style="background:#f5f5f5; padding:1rem; border-radius:4px; overflow-x:auto;">
                    <code>${slide.code}</code>
                  </pre>
                  <p class="mt-2 text-center">${slide.description}</p>
                </div>
              `;
            } else if (slide.type === "development") {
              tabHTML += `
                <div class="mb-4" style="background:#f5f5f5; padding:1rem; border-radius:4px;">
                  <p>${slide.content}</p>
                  <p class="mt-2 text-center">${slide.description}</p>
                </div>
              `;
            }
          });
          tabPane.innerHTML = tabHTML;
          tabContentContainer.appendChild(tabPane);
        });
      }
    })
    .catch(error => console.error('Error al cargar Configuration.json:', error));
});

