const container = document.getElementById("featured-projects");

async function renderFeaturedProjects() {
    try {
        const projects = await loadProjectCatalog();
        const featuredProjects = projects.filter(project => project.featured);

        featuredProjects.forEach(project => {
            const card = document.createElement("article");
            card.className = "project-card";

            const image = document.createElement("img");
            image.className = "project-image";
            image.src = project.image;
            image.alt = project.title;

            const info = document.createElement("div");
            info.className = "project-info";

            const title = document.createElement("h3");
            title.textContent = project.title;

            const categories = document.createElement("p");
            categories.className = "project-categories";
            categories.textContent = (project.categories || []).join(" · ");

            const description = document.createElement("p");
            description.className = "project-description";
            description.textContent = project.description || "";

            const meta = document.createElement("div");
            meta.className = "project-meta";

            const year = document.createElement("span");
            year.textContent = project.year ?? "";

            const status = document.createElement("span");
            status.textContent = project.status || "";

            const link = document.createElement("a");
            link.className = "project-link";
            link.href = `project.html?id=${encodeURIComponent(project.id)}`;
            link.textContent = "View Project →";

            meta.append(year, status);
            info.append(title, categories, description, meta, link);
            card.append(image, info);
            container.appendChild(card);
        });

        const previousButton = document.getElementById("projects-previous");
        const nextButton = document.getElementById("projects-next");
        const cards = [...container.querySelectorAll(".project-card")];
        const projectCount = cards.length;
        const cloneCount = projectCount > 1 ? Math.min(3, projectCount) : 0;

        if (projectCount <= 1) {
            previousButton.disabled = true;
            nextButton.disabled = true;
            return;
        }

        function cloneCard(card) {
            const clone = card.cloneNode(true);
            clone.setAttribute("aria-hidden", "true");
            clone.inert = true;
            return clone;
        }

        container.prepend(...cards.slice(-cloneCount).map(cloneCard));
        container.append(...cards.slice(0, cloneCount).map(cloneCard));

        function getCardStep() {
            const card = container.querySelector(".project-card");
            const gap = parseFloat(getComputedStyle(container).gap) || 0;
            return card.getBoundingClientRect().width + gap;
        }

        function normalizeLoopPosition() {
            const step = getCardStep();
            const index = Math.round(container.scrollLeft / step);
            const firstProjectIndex = cloneCount;
            const lastProjectIndex = cloneCount + projectCount - 1;

            if (index < firstProjectIndex) {
                container.scrollLeft = lastProjectIndex * step;
            } else if (index > lastProjectIndex) {
                container.scrollLeft = firstProjectIndex * step;
            }
        }

        function scrollOneCard(direction) {
            container.scrollBy({
                left: direction * getCardStep(),
                behavior: "smooth"
            });
        }

        previousButton.disabled = false;
        nextButton.disabled = false;
        let previousStep = getCardStep();
        container.scrollLeft = cloneCount * previousStep;

        let scrollSettleTimer;
        container.addEventListener("scroll", () => {
            clearTimeout(scrollSettleTimer);
            scrollSettleTimer = setTimeout(normalizeLoopPosition, 120);
        }, { passive: true });
        container.addEventListener("scrollend", normalizeLoopPosition);
        previousButton.addEventListener("click", () => scrollOneCard(-1));
        nextButton.addEventListener("click", () => scrollOneCard(1));
        window.addEventListener("resize", () => {
            const currentIndex = Math.round(container.scrollLeft / previousStep) - cloneCount;
            const logicalIndex = (currentIndex % projectCount + projectCount) % projectCount;

            requestAnimationFrame(() => {
                previousStep = getCardStep();
                container.scrollLeft = (cloneCount + logicalIndex) * previousStep;
            });
        });
    } catch (error) {
        container.textContent = "Project information could not be loaded.";
        console.error(error);
    }
}

renderFeaturedProjects();