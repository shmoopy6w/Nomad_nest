const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    code : {
        type : String,
    },
    status: {
        type: Boolean,
        default: false
    }

});

userSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("User", userSchema);

// Passport-Local-Mongoose will add a username , 
// hash and salt field to store the username , hashed
// password and the salt value
//Pw vo apne aap hi store krwa dengeth