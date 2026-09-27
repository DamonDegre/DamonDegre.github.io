const projects = [
    {
        id: "pip-boy",
        title: "Pip-Boy",
        year: 2026,
        status: "In Progress",
        featured: true,
        workshop: true,

        image: "images/pipboy1.JPEG",
        categories: [
            "Electronics", 
            "CAD", 
            "Programming"
        ],
        goal: "To create a fully functional overengineered wearable computer",
        description: "A wearable computer inspired by Fallout: New Vegas.",
        features: [
            "Cassete player",
            "Rotary encoders",
        ],
        materials: [
            "Raspberry Pi",
            "Cardboard",
        ],
        tools: [
            "Knife"
        ]
    },

    {
        id: "telescoping-lightsaber",
        title: "Telescoping Lightsaber",
        year: 2024,
        categories: ["Mechanical", "3D Printing"],
        status: "In Progress",
        featured: true,
        workshop: true,
        description: "A mechanically retractable lightsaber.",
        image: "images/lightsaber.JPEG"
    },

    {
        id: "color-lock",
        title: "Color Lock",
        year: 2025,
        categories: ["Electronics", "Mechanical"],
        status: "Completed",
        featured: false,
        workshop: true,
        description: "An Arduino-controlled color-sensing lock.",
        image: "images/color-lock.JPEG"
    }
];