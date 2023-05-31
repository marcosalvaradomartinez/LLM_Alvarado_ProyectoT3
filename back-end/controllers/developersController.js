import Developers from '../models/Developers.js';

export const showAllDevelopers = async (req, res) => {
    try {
        const documents = await Developers.find({});
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const showDeveloperById = async (req, res) => {
    const document = await Developers.findById(req.params.idDeveloper);
    if(!document) {
        res.json({message : 'Developer no exists'});
    }
    res.json(document);
};

export const searchDevelopersByName = async (req, res) => {
    try {
        const { query } = req.params;
        const documents = await Developers.find({ name: new RegExp(query, 'i') });
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const newDeveloper = async (req, res) => {
    const document = new Developers(req.body);
    try {
        const doc = await document.save();
        res.json({ 
            error:false,
            message : 'New developer was added with id:'+doc._id 
        });
    } catch (error) {
        //res.send(error);
        res.json({ 
            error:true,
            message : error
        });
    }
};

export const updateDeveloper = async (req, res) => {
    try {
        const filter = { _id : req.body.id };
        const update =  req.body;
        const options = {new : true};
        const document = await Developers.findOneAndUpdate(filter, update, options);
        res.json({
           "message":"Developer modified successfuly",
           ...document
        });
    } catch (error) {
        res.send(error);
    }
};

export const deleteDeveloper = async (req, res) => {
    try {
        await Developers.findByIdAndDelete({ _id : req.params.idDeveloper });
        res.json({message : 'Developer was deleted with id:'+req.params.idDeveloper });
    } catch (error) {
        console.log(error);
    }
};
