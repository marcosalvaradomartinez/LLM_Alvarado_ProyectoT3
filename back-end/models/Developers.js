import mongoose from "mongoose";
const Schema = mongoose.Schema;

const developersSchema = new Schema({
    nombre: {
        type: String,
        required: true
    }
}, 
{ versionKey: false }
);

developersSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});

const Developers =  mongoose.model('Developers', developersSchema);
export default Developers;