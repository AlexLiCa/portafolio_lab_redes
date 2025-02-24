(function () {
  // Extraer el nombre de la práctica desde la URL (formato: http://dominio/practica1/)
  const pathParts = window.location.pathname
    .split("/")
    .filter((part) => part !== "");
  const practiceFolder = pathParts[0];

  document.addEventListener("DOMContentLoaded", function () {
    // --- Cargar practicas.json (ubicado en la raíz) ---
    fetch("../practicas.json")
      .then((response) => response.json())
      .then((data) => {
        const practicas = data.practicas;
        const currentPractice = practicas.find(
          (p) => p.folder === practiceFolder
        );
        if (currentPractice) {
          // Actualizar título y fecha
          document.getElementById("practica-title").textContent =
            currentPractice.title;
          document.getElementById("practica-date").textContent =
            "Fecha: " + currentPractice.date;
          // Actualizar el resumen (usando una card con fondo rojo)
          document.getElementById("resumen").innerHTML = `
            <div class="card-header bg-danger text-white">- Resumen -</div>
            <div class="card-body">
              <p id="resumen-content" class="card-text">${currentPractice.description}</p>
            </div>
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
      .catch((error) =>
        console.error("Error al cargar practicas.json:", error)
      );

    // --- Generar la sección de autores usando la variable global "autoresGlobales" (definida en autores.js) ---
    const headerAutores = document.getElementById("header-autores");
    if (typeof autoresGlobales !== "undefined") {
      autoresGlobales.forEach((author) => {
        const col = document.createElement("div");
        col.className = "col text-center";
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

    // --- Cargar Configuration.json (ubicado en la carpeta de la práctica) ---
    fetch("Configuration.json")
      .then((response) => response.json())
      .then((data) => {
        // Actualizar la imagen de portada, si se define
        if (data.general.coverImage) {
          const coverImg = document.getElementById("coverImage");
          if (coverImg) {
            coverImg.setAttribute("src", data.general.coverImage);
          }
        }

        // Actualizar secciones generales del contenido específico:
        if (data.general) {
          const introElem = document.getElementById("intro");
          if (introElem) {
            introElem.innerHTML = `
              <div class="card-header bg-danger text-white">- Introducción -</div>
              <div class="card-body"><p class="card-text">${data.general.introduccion}</p></div>
            `;
          }
          const materialesElem = document.getElementById("materiales");
          if (materialesElem) {
            materialesElem.innerHTML = `
              <div class="card-header bg-danger text-white">- Materiales -</div>
              <div class="card-body"><p class="card-text">${data.general.materiales}</p></div>
            `;
          }
          const desarrolloElem = document.getElementById("desarrollo");
          if (desarrolloElem) {
            desarrolloElem.innerHTML = `
              <div class="card-header bg-danger text-white">- Desarrollo -</div>
              <div class="card-body"><p class="card-text">${data.general.desarrollo}</p></div>
            `;
          }
          const conclusionesElem = document.getElementById("conclusiones");
          if (conclusionesElem) {
            conclusionesElem.innerHTML = `
              <div class="card-header bg-danger text-white">- Conclusiones -</div>
              <div class="card-body"><p class="card-text">${data.general.conclusiones}</p></div>
            `;
          }
        }

        // Generar las pestañas (tabs) para el "Contenido Específico"
        if (data.tabs && Array.isArray(data.tabs)) {
          const tabsContainer = document.getElementById("configurationTabs");
          const tabContentContainer = document.getElementById(
            "configurationTabContent"
          );

          data.tabs.forEach((tab, tabIndex) => {
            const tabId = "tab-" + tabIndex;
            // Crear el botón de la pestaña
            const li = document.createElement("li");
            li.className = "nav-item";
            li.setAttribute("role", "presentation");
            li.innerHTML = `
              <button class="nav-link ${
                tabIndex === 0 ? "active" : ""
              }" id="${tabId}-tab" data-bs-toggle="tab" data-bs-target="#${tabId}" type="button" role="tab" aria-controls="${tabId}" aria-selected="${
              tabIndex === 0 ? "true" : "false"
            }">
                ${tab.title}
              </button>
            `;
            tabsContainer.appendChild(li);

            // Crear el contenido de la pestaña
            const tabPane = document.createElement("div");
            tabPane.className =
              "tab-pane fade" + (tabIndex === 0 ? " show active" : "");
            tabPane.id = tabId;
            tabPane.setAttribute("role", "tabpanel");
            tabPane.setAttribute("aria-labelledby", `${tabId}-tab`);

            let tabHTML = "";
            if (tab.slides && Array.isArray(tab.slides)) {
              tab.slides.forEach((slide) => {
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
                        Tu navegador no soporta el video.
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
            }
            tabPane.innerHTML = tabHTML;
            tabContentContainer.appendChild(tabPane);
          });
        }
        console.log("Configuration.json cargado:", data);
      })
      .catch((error) =>
        console.error("Error al cargar Configuration.json:", error)
      );
  });
})();
