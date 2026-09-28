function initializeProjectCarousel(container, previousButton, nextButton) {
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
}

function renderProjectCarousel(containerId, previousId, nextId, projects, emptyMessage) {
    const container = document.getElementById(containerId);
    const previousButton = document.getElementById(previousId);
    const nextButton = document.getElementById(nextId);
    container.replaceChildren();
    container.dataset.cardCount = String(projects.length);

    if (projects.length === 0) {
        const message = document.createElement("p");
        message.className = "carousel-empty";
        message.textContent = emptyMessage;
        container.appendChild(message);
        previousButton.disabled = true;
        nextButton.disabled = true;
        return;
    }

    projects.forEach(project => container.appendChild(createProjectCard(project)));
    initializeProjectCarousel(container, previousButton, nextButton);
}

async function renderProjectCarousels() {
    const featuredContainer = document.getElementById("featured-projects");
    const activeContainer = document.getElementById("active-projects");

    try {
        const projects = await loadProjectCatalog();
        const statusTerm = document.getElementById("active-project-carousel")
            .dataset.statusTerm.trim();
        const normalizedStatusTerm = statusTerm.toLowerCase();
        const activeProjects = projects.filter(project =>
            typeof project.status === "string" &&
            project.status.toLowerCase().includes(normalizedStatusTerm)
        );

        renderProjectCarousel(
            "featured-projects",
            "projects-previous",
            "projects-next",
            projects.filter(project => project.featured),
            "No featured projects yet."
        );
        renderProjectCarousel(
            "active-projects",
            "active-projects-previous",
            "active-projects-next",
            activeProjects,
            `No projects currently have "${statusTerm}" in their status.`
        );
    } catch (error) {
        [featuredContainer, activeContainer].forEach(container => {
            const message = document.createElement("p");
            message.className = "carousel-empty";
            message.textContent = "Project information could not be loaded.";
            container.replaceChildren(message);
        });
        ["projects-previous", "projects-next", "active-projects-previous", "active-projects-next"]
            .forEach(id => document.getElementById(id).disabled = true);
        console.error(error);
    }
}

renderProjectCarousels();
