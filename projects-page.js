const projectGrid = document.getElementById("all-projects-grid");

async function renderAllProjects() {
    try {
        const projects = await loadProjectCatalog();
        const cards = document.createDocumentFragment();

        projects.forEach(project => cards.appendChild(createProjectCard(project)));
        projectGrid.replaceChildren(cards);
    } catch (error) {
        const message = document.createElement("p");
        message.className = "carousel-empty";
        message.textContent = "Project information could not be loaded.";
        projectGrid.replaceChildren(message);
        console.error(error);
    }
}

renderAllProjects();
