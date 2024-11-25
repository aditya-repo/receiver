const Client = require("../models/clients")
const User = require("../models/users")
const Service = require("../models/services")
const SignatureUrl = require("../models/signatureurl")

const adminEventList = async (req, res) => {
    const { userid } = req.params;

    try {
        // Step 1: Fetch user's phone number
        const user = await User.findById(userid).select('phone').lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Step 2: Fetch event list with clientId and occasionname
        const eventList = await Client.find({ contact: user.phone })
            .select('clientId occassionname')
            .lean();

        const clientIds = eventList.map(event => event.clientId);

        // Step 3: Fetch services with completed status
        const serviceStatusList = await Service.find({
            clientId: { $in: clientIds },
            status: 'completed'
        }).select('clientId folder').lean();

        const serviceClientFolders = serviceStatusList.reduce((acc, service) => {
            acc[service.clientId] = service.folder;
            return acc;
        }, {});

        // Step 4: Fetch image list
        const imageList = await SignatureUrl.find({ clientId: { $in: clientIds } }).lean();

        // Step 5: Map imageList with finalName and group by clientId and occassionname
        const finalImageList = eventList
            .map(event => {
                const filteredImages = imageList
                    .filter(image => image.clientId === event.clientId)
                    .map(image => {
                        const folders = serviceClientFolders[image.clientId] || [];
                        const matchedFolder = folders.find(folder => folder.indexname === image.name);

                        return {
                            ...image,
                            finalName: matchedFolder ? matchedFolder.foldername : null
                        };
                    });

                // Only include clients with at least one image
                if (filteredImages.length > 0) {
                    return {
                        clientId: event.clientId,
                        occassionname: event.occassionname,
                        data: filteredImages
                    };
                }
                return null;
            })
            .filter(client => client !== null); // Remove clients with no images

        // Step 6: Respond with the final structured image list
        res.json(finalImageList);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports = { adminEventList }