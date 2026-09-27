async function loadProjectData(id) {
    const response = await fetch(`projects/${encodeURIComponent(id)}.md`);

    if (!response.ok) {
        const error = new Error(`Could not load project ${id}: ${response.status}`);
        error.status = response.status;
        throw error;
    }

    const lines = (await response.text()).split(/\r?\n/);
    if (lines[0] !== "---") {
        throw new Error(`Project ${id} is missing its JSON front matter.`);
    }

    const frontMatterEnd = lines.indexOf("---", 1);
    if (frontMatterEnd === -1) {
        throw new Error(`Project ${id} has an unterminated front matter block.`);
    }

    const project = JSON.parse(lines.slice(1, frontMatterEnd).join("\n"));
    if (project.id !== id) {
        throw new Error(`Project ID in ${id}.md does not match its filename.`);
    }

    project.log = lines.slice(frontMatterEnd + 1).join("\n").trim();
    return project;
}

async function loadProjectCatalog() {
    const response = await fetch("projects/index.json");
    if (!response.ok) {
        throw new Error(`Could not load project index: ${response.status}`);
    }

    const projectIds = await response.json();
    return Promise.all(projectIds.map(loadProjectData));
}
