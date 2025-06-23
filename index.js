// [SECTION] Dependencies
const express = require("express");
const mongoose = require("mongoose");

// [SECTION] Routes Middleware
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

// [SECTION] Environment Setup
require('dotenv').config();

// [SECTION] Server Setup
const app = express();
app.use(express.json());

// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'))

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}
	
module.exports = {app,mongoose};
