const mongoose = require('mongoose');
const { Schema } = mongoose;

// this creates the schedma/mapping fields.
// Can add more to this
const userSchema = new Schema({
    googleId: String
});

// this actually creates the model (table/index) if it doesnt exist
// we are loading the userSchema into the db
mongoose.model('users',userSchema); 