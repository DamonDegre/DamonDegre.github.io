const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

function setProjectDetail(elementId, label, value) {
    const element = document.getElementById(elementId);

    if (value === undefined || value === null || value === "" ||
        (Array.isArray(value) && value.length === 0)) {
        element.replaceChildren();
        element.hidden = true;
        return;
    }

    const labelElement = document.createElement("strong");
    labelElement.textContent = `${label}: `;

    if (Array.isArray(value)) {
        const list = document.createElement("ul");
        list.className = "project-detail-list";

        value.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            list.appendChild(listItem);
        });

        element.replaceChildren(labelElement, list);
    } else {
        element.replaceChildren(labelElement, document.createTextNode(value));
    }

    element.hidden = false;
}

function createProjectLogMedia(source) {
    const cleanSource = source.trim().replace(/^<(.+)>$/, "$1");
    let mediaUrl;

    try {
        mediaUrl = new URL(cleanSource, window.location.href);
    } catch {
        return null;
    }

    if (mediaUrl.protocol !== "http:" && mediaUrl.protocol !== "https:") {
        return null;
    }

    const media = document.createElement("figure");
    media.className = "project-log-media";

    if (mediaUrl.hostname === "drive.google.com") {
        const driveFileId = mediaUrl.pathname.match(/\/file\/d\/([^/]+)/)?.[1]
            || mediaUrl.searchParams.get("id");

        if (!driveFileId) return null;

        const frame = document.createElement("iframe");
        frame.src = `https://drive.google.com/file/d/${encodeURIComponent(driveFileId)}/preview`;
        frame.title = "Project log video";
        frame.allow = "autoplay; encrypted-media";
        frame.allowFullscreen = true;
        frame.loading = "lazy";
        media.appendChild(frame);
        return media;
    }

    const path = mediaUrl.pathname.toLowerCase();

    if (/\.(avif|gif|jpe?g|png|svg|webp)$/.test(path)) {
        const image = document.createElement("img");
        image.src = mediaUrl.href;
        image.alt = "Media from the project log";
        image.loading = "lazy";
        media.appendChild(image);
        return media;
    }

    if (/\.(m4v|mov|mp4|ogv|webm)$/.test(path)) {
        const video = document.createElement("video");
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";

        const sourceElement = document.createElement("source");
        sourceElement.src = mediaUrl.href;
        video.appendChild(sourceElement);
        media.appendChild(video);
        return media;
    }

    return null;
}

function renderProjectLog(markdown) {
    const logElement = document.getElementById("project-log");

    if (!markdown) {
        logElement.textContent = "No process log has been added for this project yet.";
        return;
    }

    const lines = markdown.split(/\r?\n/);
    logElement.replaceChildren();

    lines.forEach((line, index) => {
        const mediaMarker = line.match(/^##\s+(.+)$/);
        const media = mediaMarker && createProjectLogMedia(mediaMarker[1]);
        const heading = line.match(/^#+\s+(.+)$/);

        if (media) {
            logElement.appendChild(media);
        } else if (heading) {
            const boldHeading = document.createElement("strong");
            boldHeading.textContent = heading[1];
            logElement.appendChild(boldHeading);
        } else {
            logElement.appendChild(document.createTextNode(line));
        }

        if (!media && index < lines.length - 1) {
            logElement.appendChild(document.createElement("br"));
        }
    });
}

async function renderProjectPage() {
    const page = document.getElementById("project-page");

    try {
        const project = await loadProjectData(projectId);

        document.getElementById("project-title").textContent = project.title;
        document.getElementById("project-image").src = project.image;
        document.getElementById("project-image").alt = project.title;

        document.getElementById("project-categories").textContent =
            (project.categories || []).join(" · ");
        document.getElementById("project-year").textContent = project.year ?? "";
        document.getElementById("project-status").textContent = project.status || "";

        setProjectDetail("project-description", "Description", project.description);
        setProjectDetail("project-goal", "Goal", project.goal);
        setProjectDetail("project-features", "Features", project.features);
        setProjectDetail("project-materials", "Materials", project.materials);
        setProjectDetail("project-tools", "Tools", project.tools);
        renderProjectLog(project.log);
    } catch (error) {
        const heading = document.createElement("h1");
        const message = document.createElement("p");

        if (error.status === 404) {
            heading.textContent = "Project not found";
            message.textContent = "Sorry, we couldn't find that project.";
        } else {
            heading.textContent = "Project unavailable";
            message.textContent = "Project information could not be loaded.";
            console.error(error);
        }

        page.replaceChildren(heading, message);
    }
}

renderProjectPage();
