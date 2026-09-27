const featuredProjects = projects.filter(project => project.featured);

const container = document.getElementById("featured-projects");

featuredProjects.forEach(project => {
    const card = document.createElement("div");

    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <p>${project.year}</p>
    `;

    container.appendChild(card);
});