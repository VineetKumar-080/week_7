const mongoose  = require("mongoose")
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId


// schema for User
const User = new Schema({
    email: {type:String, unique: true},
    password : String,
    name : String, 
})


// schema for Todo
const Todo = new Schema({
    title : String,
    done: Boolean,
    userId: ObjectId
})

//UserModel is used to interact with the 'users' collection in MongoDB,

const UserModel = mongoose.model('users', User)

const TodoModel = mongoose.model('todos',Todo)

module.exports = {
    UserModel : UserModel,
    TodoModel : TodoModel
}