const Client = require("../models/clients")
const Studio = require("../models/studios")
const Wallet = require("../models/wallet")

const allStudio = (req, res)=>{

}

const getDashboardDetails = async (req, res)=>{

    const studios = await Studio.find({})
    const clients = await Client.find({})

    // console.log(result);
    
    const totalStudioCount = studios.length
    const activeStudioCount = studios.filter(studio => (studio.status) === '1').length;
    const totalClientCount = clients.length
    const activeClientCount = clients.filter(client=> (client.status) === '1').length

    const payload = { totalStudioCount, activeStudioCount, totalClientCount, activeClientCount}
    
    console.log(payload);
    
    
    res.status(200).json({payload, studios})
}


const studioSignup = async (req, res) => {

    try {
        console.log("Hello");

        // Extract data from request body
        let { name, userid, studiocode, password, description, location, contact1, contact2, email } = req.body.formData;

        // Validate required fields
        if (!name || !userid || !studiocode || !password || !contact1) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new Studio instance
        const newStudio = new Studio({
            name, userid, studiocode, password: hashedPassword, description, location, contact1, contact2, email
        });

        // Save the studio to the database
        await newStudio.save();

        const newWallet = new Wallet({studiocode, credit: 0})
        await newWallet.save()

        return res.status(201).json({ message: "Studio created successfully", studio: newStudio });

    } catch (error) {
        // Handle any errors
        console.error('Error saving studio data:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const singleStudio = async (req, res)=>{
    const {studiocode} = req.params
    const studiodata = await Studio.findOne({studiocode})
    console.log("studio", studiodata);
    res.status(200).json(studiodata)
}

const updateStudio = async (req, res)=>{

    const {studiocode} = req.params

    const {name, userid, manager, description, location, contact1, contact2, email, whatsapp} = req.body
    
    const studiodata = await Studio.findOneAndUpdate({studiocode}, { name, userid, manager, description, location, contact1, contact2, email, whatsapp }, { new: true } )

    res.json({ message: 'Update successful', data: studiodata });
}


const deleteStudio = async (req, res)=>{

    const {studiocode} = req.params
    
    const studiodata = await Studio.findOneAndUpdate({studiocode}, { isdeleted: true }, { new: true } )

    res.json({ message: 'Update successful', data: studiodata });
}

const deletedStudio = async (req, res)=>{
    const studiodata = await Studio.find({isdeleted: true})
    res.json(studiodata)
}

const singleClient = (req, res)=>{

}

const updateClient = (req, res)=>{

}


const pauseStudioService = (req, res)=>{

}

const updateCreditCount = (req, res)=>{

}

const cloudStatus = (req, res)=>{

}

const serviceInfo = (req, res)=>{

}

const photographerData = (req, res)=>{

}

const clientData = (req, res)=>{

}

const userData = (req, res)=>{

}

const serviceDurationExtension = (req, res)=>{
    
}

module.exports = {
    getDashboardDetails,
    singleStudio,
    updateStudio,
    studioSignup,
    deleteStudio,
    deletedStudio
}