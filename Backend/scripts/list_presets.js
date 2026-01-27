const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dttb9lvfl',
    api_key: '168275564519655',
    api_secret: 'ZY6CLwCK64k7C7xcxeH0rdpMIiA'
});

async function listPresets() {
    try {
        const result = await cloudinary.api.upload_presets();
        console.log("Existing Presets:");
        result.presets.forEach(p => {
            console.log(`- Name: ${p.name}, Unsigned: ${p.unsigned}`);
        });
    } catch (error) {
        console.error("Error listing presets:", error);
    }
}

listPresets();
