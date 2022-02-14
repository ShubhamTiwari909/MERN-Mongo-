const mongo = require('./mongo')
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userSchema = require('./schemas/schema')

const app = express();

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));


const getData = () => {
    return userSchema.find({})
}

//get method to get all data
app.get('/', (req, res) => {
    const connectToMongodb = async (logic) => {
        await mongo().then(async (mongoose) => {
            try {
                console.log('connected successfully')
                const result = await logic();
                res.send(result)
            }
            finally {
                console.log("done posted")
            }
        })
    }
    connectToMongodb(getData)
})


//post method to add data with
app.post('/post', (req, res) => {
    const saveData = () => {
        const user = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }
        return new userSchema(user).save()
    }

    const connectToMongodb = async (logic) => {
        await mongo().then(async (mongoose) => {
            try {
                console.log('connected successfully')
                const result = await logic();
                console.log(result)
                res.send(result)
            }
            finally {
                mongoose.connection.close()
            }
        })
    }

    connectToMongodb(saveData)

})

//post method to add data with
app.delete('/delete/:id', (req, res) => {

    const connectToMongodb = async () => {
        await mongo().then(async (mongoose) => {
            try {
                console.log('connected successfully');
                const id = req.params.id
                const result = await userSchema.remove({ '_id': id })
                console.log(result)
                res.send(result)
            }
            finally {
                mongoose.connection.close()
            }
        })
    }

    connectToMongodb()

})


    //update method to get data with an id
    app.put('/update', (req, res) => {
        const connectToMongodb = async () => {
            await mongo().then(async (mongoose) => {
                try {

                    let updateId = req.body.updateId;
                    let updateTask = req.body.task;
                    console.log(updateId,updateTask)
                    const result = await userSchema.update({ '_id': updateId }, { $set: { 'email': updateTask } })
                    console.log(result)
                    res.send(result)
                }
                finally {
                    mongoose.connection.close()
                }
            })
        }

        connectToMongodb()
    })




//starting the server
app.listen(port, () => {
    console.log(`litening on ${port}`);
})