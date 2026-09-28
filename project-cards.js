function createProjectCard(project) {
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
    return card;
}
