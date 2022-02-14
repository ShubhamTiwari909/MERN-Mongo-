const mongoose = require("mongoose");

const DB = "mongodb+srv://Shubham:Shubham909@cluster0.d9wx7.mongodb.net/Todo?retryWrites=true&w=majority";

module.exports = async () => {
    await mongoose.connect(DB , {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    return mongoose
}

