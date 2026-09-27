const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

const project = projects.find(project => project.id === projectId);

async function loadProjectLog(id) {
    const logElement = document.getElementById("project-log");

    try {
        const response = await fetch(`project_logs/${encodeURIComponent(id)}.md`);

        if (response.status === 404) {
            logElement.textContent = "No process log has been added for this project yet.";
            return;
        }

        if (!response.ok) {
            throw new Error(`Failed to load project log: ${response.status}`);
        }

        const lines = (await response.text()).split(/\r?\n/);
        logElement.replaceChildren();

        lines.forEach((line, index) => {
            const heading = line.match(/^##\s+(.+)$/);

            if (heading) {
                const boldHeading = document.createElement("strong");
                boldHeading.textContent = heading[1];
                logElement.appendChild(boldHeading);
            } else {
                logElement.appendChild(document.createTextNode(line));
            }

            if (index < lines.length - 1) {
                logElement.appendChild(document.createElement("br"));
            }
        });
    } catch (error) {
        logElement.textContent = "The process log could not be loaded.";
        console.error(error);
    }
}

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

    loadProjectLog(project.id);

} else {

    document.getElementById("project-page").innerHTML = `
        <h1>Project not found</h1>
        <p>Sorry, we couldn't find that project.</p>
    `;
}