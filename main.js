const featuredProjects = projects.filter(project => project.featured);

const container = document.getElementById("featured-projects");

featuredProjects.forEach(project => {
    const card = document.createElement("article");
    card.className = "project-card";

    card.innerHTML = `
        <img class="project-image" src="${project.image}" alt="${project.title}">

        <div class="project-info">
            <h3>${project.title}</h3>

            <p class="project-categories">
                ${project.categories.join(" · ")}
            </p>

            <p class="project-description">
                ${project.description}
            </p>

            <div class="project-meta">
                <span>${project.year}</span>
                <span>${project.status}</span>
            </div>

            <a href="project.html?id=${project.id}" class="project-link">
                View Project →
            </a>
        </div>
    `;

    container.appendChild(card);
});