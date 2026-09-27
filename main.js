const featuredProjects = projects.filter(project => project.featured);

const container = document.getElementById("featured-projects");

featuredProjects.forEach(project => {
    const card = document.createElement("article");
    card.className = "project-card";

    card.innerHTML = `
        <img class="project-image" src="${project.image}" alt="${project.title}">

        <div class="project-info">
            <h3>${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <p class="project-year">${project.year}</p>
        </div>
    `;

    container.appendChild(card);
});