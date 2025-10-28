document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    toggle.classList.toggle("active");
  });

  const imagens = ["imagens/foto1.png", "imagens/foto2.png"];

  const hero = document.querySelector(".hero");
  let indice = 0;

  // cria as duas camadas
  const bg1 = document.createElement("div");
  bg1.classList.add("bg", "active");

  hero.appendChild(bg1);

  function trocaImagem() {
    const atual = hero.querySelector(".bg.active");
    const proxima = hero.querySelector(".bg:not(.active)");

    indice = (indice + 1) % imagens.length;
    proxima.style.backgroundImage = `url(${imagens[indice]})`;

    proxima.style.opacity = 1;
    atual.style.opacity = 0;

    atual.classList.remove("active");
    proxima.classList.add("active");
  }

  document.querySelectorAll(".bg").forEach((bg, i) => {
    bg.style.position = "absolute";
    bg.style.inset = 0;
    bg.style.backgroundSize = "cover";
    bg.style.backgroundPosition = "center";
    bg.style.transition = "opacity 2s ease-in-out";
    bg.style.zIndex = 0;
    bg.style.opacity = i === 0 ? 1 : 0;
    bg.style.backgroundImage = `url(${imagens[i]})`;
  });

  setInterval(trocaImagem, 5000); // troca a cada 5 segundos

  async function carregarEventos() {
    try {
      const url =
        "https://3jsbbjk7.api.sanity.io/v2025-10-15/data/query/production?query=*%5B_type%20%3D%3D%20%27event%27%5D%7Btitle%2C%20link%2C%20%22coverImage%22%3AcoverImage.asset-%3Eurl%7D";
      const response = await fetch(url, { method: "GET" });
      const json = await response.json();
      console.log("Sanity API Response:", json);
      const eventsGrid = document.getElementById("events-grid");
      eventsGrid.innerHTML = "";
      if (json.result && json.result.length > 0) {
        json.result.forEach((element) => {
          console.log("Creating event card for:", element);
          const img = document.createElement("img");
          img.src =
            element.coverImage ||
            "https://via.placeholder.com/400x250/5C7E34/FFFFFF?text=Sem+Imagem";
          img.alt = element.title || "Evento sem título";
          img.classList.add("event-image");
          const h3 = document.createElement("h3");
          h3.innerText = element.title || "Evento sem título";
          const btn = document.createElement("a");
          btn.href = element.link || "#";
          btn.classList.add("btn");
          btn.innerText = "Inscreva-se";
          if (element.link) {
            btn.target = "_blank";
          }
          const eventContent = document.createElement("div");
          eventContent.classList.add("event-content");
          eventContent.append(h3, btn);
          const eventCard = document.createElement("div");
          eventCard.classList.add("event-card");
          eventCard.append(img, eventContent);
          eventsGrid.append(eventCard);
        });
      } else {
        const mensagem = document.createElement("p");
        mensagem.style.textAlign = "center";
        mensagem.style.gridColumn = "1 / -1";
        mensagem.style.fontSize = "1.2rem";
        mensagem.style.color = "#19481E";
        mensagem.innerText = "Nenhum evento cadastrado no momento.";
        eventsGrid.append(mensagem);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      const eventsGrid = document.getElementById("events-grid");
      eventsGrid.innerHTML = "";
      const mensagem = document.createElement("p");
      mensagem.style.textAlign = "center";
      mensagem.style.gridColumn = "1 / -1";
      mensagem.style.fontSize = "1.2rem";
      mensagem.style.color = "#19481E";
      mensagem.innerText =
        "Erro ao carregar eventos. Tente novamente mais tarde.";
      eventsGrid.append(mensagem);
    }
  }

  async function carregarGaleria() {
    try {
      const url =
        "https://3jsbbjk7.api.sanity.io/v2025-10-17/data/query/production?query=*%0A%5B_type+%3D%3D+%27album%27%5D%0A%7Btitle%2C+description%2C+%22cover%22%3A+cover.asset-%3Eurl%2C+photos%5B%5D%7B%22url%22%3A+asset-%3Eurl%7D%7D&perspective=drafts";

      const response = await fetch(url, {
        method: "GET",
      });

      const json = await response.json();
      console.log("Sanity API Response for Gallery:", json);
      const galleryGrid = document.getElementById("gallery-grid");
      const modal = document.createElement("div");
      modal.classList.add("modal");
      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
      const closeBtn = document.createElement("button");
      closeBtn.classList.add("modal-close");
      closeBtn.innerText = "×";
      const modalPhotos = document.createElement("div");
      modalPhotos.classList.add("modal-photos");
      modalContent.append(closeBtn, modalPhotos);
      modal.append(modalContent);
      document.body.append(modal);

      galleryGrid.innerHTML = "";

      if (json.result && json.result.length > 0) {
        json.result.forEach((album) => {
          const item = document.createElement("div");
          item.classList.add("gallery-item");

          const img = document.createElement("img");
          img.src = `${album.cover}?w=600&h=400&fit=crop&auto=format&q=75`;
          img.alt = `${album.title} - Capa`;
          img.classList.add("gallery-cover");

          const content = document.createElement("div");
          content.classList.add("gallery-content");
          const title = document.createElement("h3");
          title.innerText = album.title || "Álbum sem título";
          const desc = document.createElement("p");
          desc.innerText = album.description || "Sem descrição";
          content.append(title, desc);

          item.append(img, content);

          item.addEventListener("click", () => {
            modalPhotos.innerHTML = "";
            modal.classList.add("active");
            const photos = album.photos || [];
            if (album.cover && photos.length === 0) {
              const photoImg = document.createElement("img");
              photoImg.src = `${album.cover}?w=800&auto=format&q=75`;
              photoImg.alt = `${album.title} - Capa`;
              photoImg.classList.add("modal-photo");
              modalPhotos.append(photoImg);
            } else {
              photos.forEach((photo) => {
                if (photo.url) {
                  const photoImg = document.createElement("img");
                  photoImg.src = `${photo.url}?w=800&auto=format&q=75`;
                  photoImg.alt = `${album.title} - Foto`;
                  photoImg.classList.add("modal-photo");
                  modalPhotos.append(photoImg);
                }
              });
            }
          });

          galleryGrid.append(item);
        });
      } else {
        const mensagem = document.createElement("p");
        mensagem.style.textAlign = "center";
        mensagem.style.gridColumn = "1 / -1";
        mensagem.style.fontSize = "1.2rem";
        mensagem.style.color = "#19481E";
        mensagem.innerText = "Nenhum álbum cadastrado no momento.";
        galleryGrid.append(mensagem);
      }

      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });
    } catch (error) {
      console.error("Erro ao carregar galeria:", error);
      const galleryGrid = document.getElementById("gallery-grid");
      galleryGrid.innerHTML = "";
      const mensagem = document.createElement("p");
      mensagem.style.textAlign = "center";
      mensagem.style.gridColumn = "1 / -1";
      mensagem.style.fontSize = "1.2rem";
      mensagem.style.color = "#19481E";
      mensagem.innerText =
        "Erro ao carregar galeria. Tente novamente mais tarde.";
      galleryGrid.append(mensagem);
    }
  }

  carregarEventos();
  carregarGaleria();
});
