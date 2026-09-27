const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

const project = projects.find(project => project.id === projectId);

if (project) {

    document.getElementById("project-title").textContent = project.title;

    document.getElementById("project-image").src = project.image;
    document.getElementById("project-image").alt = project.title;

    document.getElementById("project-description").textContent =
        project.description;

    document.getElementById("project-year").textContent =
        `Year: ${project.year}`;

    document.getElementById("project-status").textContent =
        `Status: ${project.status}`;

    document.getElementById("project-categories").textContent =
        `Categories: ${project.categories.join(" · ")}`;

} else {

    document.getElementById("project-page").innerHTML = `
        <h1>Project not found</h1>
        <p>Sorry, we couldn't find that project.</p>
    `;
}