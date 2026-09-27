const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

const project = projects.find(project => project.id === projectId);

function setProjectDetail(elementId, label, value) {
    const element = document.getElementById(elementId);

    if (value === undefined || value === null || value === "" ||
        (Array.isArray(value) && value.length === 0)) {
        element.replaceChildren();
        element.hidden = true;
        return;
    }

    const displayValue = Array.isArray(value) ? value.join(", ") : value;
    const labelElement = document.createElement("strong");
    labelElement.textContent = `${label}: `;
    element.replaceChildren(labelElement, document.createTextNode(displayValue));
    element.hidden = false;
}

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

    document.getElementById("project-categories").textContent =
        project.categories.join(" · ");
        
    document.getElementById("project-year").textContent = project.year;
    document.getElementById("project-status").textContent = project.status;

    setProjectDetail("project-description", "Description", project.description);
    setProjectDetail("project-goal", "Goal", project.goal);
    setProjectDetail("project-features", "Features", project.features);
    setProjectDetail("project-materials", "Materials", project.materials);
    setProjectDetail("project-tools", "Tools", project.tools);

    loadProjectLog(project.id);

} else {

    document.getElementById("project-page").innerHTML = `
        <h1>Project not found</h1>
        <p>Sorry, we couldn't find that project.</p>
    `;
}