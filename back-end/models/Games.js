import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gamesSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    imagen: {
        type: String
    },
    desarrollador: {
        type: mongoose.Schema.ObjectId,
        ref: 'Developers'
    },
    pegi: {
        type: Number,
        required: true
    },
    precio:{
        type: Number
    },
    plataforma:{
        type: String
    },
    informacion: {
        type: mongoose.Schema.ObjectId,
        ref: 'Descriptions'
    }
}, 
{ versionKey: false }
);

gamesSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});

const Games =  mongoose.model('Games', gamesSchema);
export default Games;