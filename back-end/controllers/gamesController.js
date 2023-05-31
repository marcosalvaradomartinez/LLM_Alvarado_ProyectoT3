import Games from '../models/Games.js';

export const showAllGames = async (req, res) => {
    try {
        const documents = await Games.find({}).populate("desarrollador");
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const showAllGamesSinopsis = async (req, res) =>{
    try{
        const documentsInfo = await Games.find({}).populate("informacion");
        res.json(documentsInfo)
    } catch (error) {
        console.log(error);
    }
}

export const showGameById = async (req, res) => {
    const document = await Games.findById(req.params.idGame);
    if(!document) {
        res.json({message : 'Game no exists'});
    }
    res.json(document);
};

export const searchGamesByName = async (req, res) => {
    try {
        const { query } = req.params;
        const documents = await Games.find({ name: new RegExp(query, 'i') });
        res.json(documents);
    } catch (error) {
        console.log(error);
    }
};

export const newGame = async (req, res) => {
    const document = new Games(req.body);
    try {
        const doc = await document.save();
        res.json({ 
            error:false,
            message : 'New game was added with id:'+doc._id 
        });
    } catch (error) {
        //res.send(error);
        res.json({ 
            error:true,
            message : error
        });
    }
};

export const updateGame = async (req, res) => {
    try {
        const filter = { _id : req.body.id };
        const update =  req.body;
        const options = {new : true};
        const document = await Games.findOneAndUpdate(filter, update, options);
        res.json({
           "message":"Game modified successfuly",
           ...document
        });
    } catch (error) {
        res.send(error);
    }
};

export const deleteGame = async (req, res) => {
    try {
        await Games.findByIdAndDelete({ _id : req.params.idGame });
        res.json({message : 'Game was deleted with id:'+req.params.idGame });
    } catch (error) {
        console.log(error);
    }
};
