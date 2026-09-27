async function loadSiteChrome() {
    const includes = [
        ["site-header", "header.html"],
        ["site-footer", "footer.html"]
    ];

    await Promise.all(includes.map(async ([placeholderId, file]) => {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Could not load ${file}: ${response.status}`);
        }

        document.getElementById(placeholderId).innerHTML = await response.text();
    }));
}

loadSiteChrome().catch(error => console.error("Site header/footer failed to load:", error));
