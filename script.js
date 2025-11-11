document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    toggle.classList.toggle("active");
  });

// ====== CARROSSEL DINÂMICO COM FOTOS DOS ÁLBUNS DO SANITY ======
const hero = document.querySelector(".hero");
let indice = 0;
let imagensDinamicas = [];

// Cria as duas camadas de background
const bg1 = document.createElement("div");
const bg2 = document.createElement("div");
bg1.classList.add("bg", "active");
bg2.classList.add("bg");
hero.appendChild(bg1);
hero.appendChild(bg2);

// Função para carregar fotos dos álbuns
async function carregarImagensHero() {
  try {
    const url = "https://3jsbbjk7.api.sanity.io/v2025-10-17/data/query/production?query=*[_type == 'album']{photos[]{ 'url': asset->url }, 'cover': cover.asset->url }";
    const response = await fetch(url);
    const json = await response.json();

    const todasFotos = [];

    json.result.forEach(album => {
      // Adiciona a capa
      if (album.cover) todasFotos.push(album.cover);
      // Adiciona todas as fotos do álbum
      if (album.photos && album.photos.length > 0) {
        album.photos.forEach(photo => {
          if (photo.url) todasFotos.push(photo.url);
        });
      }
    });

    // Embaralha para ficar mais natural (ou deixa em ordem se preferir)
    imagensDinamicas = todasFotos
      .sort(() => Math.random() - 0.5)
      .slice(0, 20); // pega até 20 fotos (evita carregar demais)

    // Se não tiver fotos, usa as fixas como fallback
    if (imagensDinamicas.length === 0) {
      imagensDinamicas = [
        "imagens/foto1.png",
        "imagens/foto2.png"
      ];
    }

    // Aplica as duas primeiras imagens
    document.querySelectorAll(".bg").forEach((bg, i) => {
      bg.style.backgroundImage = `url(${imagensDinamicas[i] || imagensDinamicas[0]})`;
      bg.style.opacity = i === 0 ? 1 : 0;
    });

    // Inicia o carrossel
    setInterval(trocaImagem, 5000);

  } catch (erro) {
    console.error("Erro ao carregar imagens do hero:", erro);
    // Fallback seguro
    imagensDinamicas = ["imagens/foto1.png", "imagens/foto2.png"];
    document.querySelectorAll(".bg").forEach((bg, i) => {
      bg.style.backgroundImage = `url(${imagensDinamicas[i]})`;
    });
    setInterval(trocaImagem, 5000);
  }
}

// Função de troca com fade
function trocaImagem() {
  const atual = hero.querySelector(".bg.active");
  const proxima = hero.querySelector(".bg:not(.active)");

  indice = (indice + 1) % imagensDinamicas.length;
  const proximaImagem = imagensDinamicas[indice];

  proxima.style.backgroundImage = `url(${proximaImagem})`;
  proxima.style.opacity = 1;
  atual.style.opacity = 0;

  atual.classList.remove("active");
  proxima.classList.add("active");
}

// Estiliza os backgrounds
document.querySelectorAll(".bg").forEach((bg, i) => {
  bg.style.position = "absolute";
  bg.style.inset = 0;
  bg.style.backgroundSize = "cover";
  bg.style.backgroundPosition = "center";
  bg.style.transition = "opacity 2s ease-in-out";
  bg.style.zIndex = 0;
  bg.style.opacity = i === 0 ? 1 : 0;
});

// Inicia o carregamento das imagens
carregarImagensHero();

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
        "https://3jsbbjk7.api.sanity.io/v2025-11-11/data/query/production?query=*%5B_type+%3D%3D+%22album%22%5D+%7C+order%28title+asc%29%7Btitle%2Cdescription%2C%22cover%22%3Acover.asset-%3Eurl%2Cphotos%5B%5D%7B%22url%22%3Aasset-%3Eurl%7D%7D&perspective=drafts";

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

    // Carrossel de Notícias
  async function carregarNoticias() {
    try {
      const url =
        "https://3jsbbjk7.api.sanity.io/v2025-10-30/data/query/production?query=*%0A%5B_type+%3D%3D+%27news%27%5D%0A%7Btitle%2C+excerpt%2C+link%2C+%22image%22%3Aimage.asset-%3Eurl%7D&perspective=drafts";

      const response = await fetch(url, { method: "GET" });
      const json = await response.json();
      console.log("Sanity API Response for News:", json);

      const carousel = document.getElementById("news-carousel");
      const dotsContainer = document.getElementById("news-dots");

      carousel.innerHTML = "";
      dotsContainer.innerHTML = "";

      if (json.result && json.result.length > 0) {
        json.result.forEach((noticia, index) => {
          // Criar item de notícia
          const newsItem = document.createElement("div");
          newsItem.classList.add("news-item");

          const img = document.createElement("img");
          img.src =
            noticia.image ||
            "https://via.placeholder.com/900x400/5C7E34/FFFFFF?text=Sem+Imagem";
          img.alt = noticia.title || "Notícia";
          img.classList.add("news-image");

          const content = document.createElement("div");
          content.classList.add("news-content");


          const title = document.createElement("h3");
          title.innerText = noticia.title || "Notícia sem título";

          const excerpt = document.createElement("p");
          excerpt.innerText =
            noticia.excerpt || "Descrição não disponível.";

          const link = document.createElement("a");
          link.href = noticia.link || "#";
          link.classList.add("news-link");
          link.innerText = "Leia mais →";
          if (noticia.link) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          }

          content.append(title, excerpt, link);
          newsItem.append(img, content);
          carousel.append(newsItem);

          // Criar dot de navegação
          const dot = document.createElement("span");
          dot.classList.add("dot");
          if (index === 0) dot.classList.add("active");
          dot.addEventListener("click", () => goToSlide(index));
          dotsContainer.append(dot);
        });

        // Configurar navegação do carrossel
        let currentIndex = 0;
        const totalSlides = json.result.length;

        function goToSlide(index) {
          currentIndex = index;
          carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
          updateDots();
        }

        function updateDots() {
          const dots = document.querySelectorAll(".dot");
          dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
          });
        }

        document.getElementById("news-prev").addEventListener("click", () => {
          currentIndex = currentIndex > 0 ? currentIndex - 1 : totalSlides - 1;
          goToSlide(currentIndex);
        });

        document.getElementById("news-next").addEventListener("click", () => {
          currentIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
          goToSlide(currentIndex);
        });

      } else {
        const mensagem = document.createElement("div");
        mensagem.classList.add("news-item");
        mensagem.innerHTML = `
          <div class="news-content" style="text-align: center; padding: 3rem;">
            <p style="font-size: 1.2rem; color: #19481E;">Nenhuma notícia cadastrada no momento.</p>
          </div>
        `;
        carousel.append(mensagem);
      }
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
      const carousel = document.getElementById("news-carousel");
      carousel.innerHTML = "";
      const mensagem = document.createElement("div");
      mensagem.classList.add("news-item");
      mensagem.innerHTML = `
        <div class="news-content" style="text-align: center; padding: 3rem;">
          <p style="font-size: 1.2rem; color: #19481E;">Erro ao carregar notícias. Tente novamente mais tarde.</p>
        </div>
      `;
      carousel.append(mensagem);
    }
  }

  carregarEventos();
  carregarGaleria();
  carregarNoticias();

  // Botão Ler mais - Nossa História (mobile)
  const readMoreBtn = document.getElementById("read-more-btn");
  const historyFull = document.getElementById("history-full");

  if (readMoreBtn && historyFull) {
    readMoreBtn.addEventListener("click", () => {
      const isExpanded = historyFull.classList.toggle("expanded");
      readMoreBtn.classList.toggle("expanded");
      
      if (isExpanded) {
        readMoreBtn.innerHTML = 'Ler menos';
        // Scroll suave até o conteúdo expandido
        historyFull.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        readMoreBtn.innerHTML = 'Ler mais';
      }
    });
  }
});

