const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dttb9lvfl',
    api_key: '168275564519655',
    api_secret: 'ZY6CLwCK64k7C7xcxeH0rdpMIiA'
});

async function createPreset() {
    try {
        console.log("Checking for existing preset 'glam_test'...");

        // Check if exists (try to get it)
        try {
            await cloudinary.api.upload_preset('glam_test');
            console.log("Preset 'glam_test' already exists. Updating to ensure it is unsigned.");
            await cloudinary.api.update_upload_preset('glam_test', {
                unsigned: true,
                folder: 'glam_participants'
            });
            console.log("Preset updated successfully.");
            return;
        } catch (e) {
            // If 404, it doesn't exist
            console.log("Preset not found. Creating new one...");
        }

        const result = await cloudinary.api.create_upload_preset({
            name: 'glam_test',
            unsigned: true,
            folder: 'glam_participants',
            allowed_formats: ['jpg', 'png', 'mp4', 'mov', 'pdf'],
        });

        console.log("Success! Upload preset created:", result.name);
    } catch (error) {
        console.error("Error creating preset:", error);
    }
}

createPreset();
