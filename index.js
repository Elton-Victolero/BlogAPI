// [SECTION] Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// [SECTION] Environment Setup
require('dotenv').config();

// [SECTION] Routes Middleware
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());

app.use(cors({
	origin: ["http://localhost:3000", "https://blogapi-3cr8.onrender.com"]
}));

// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'))

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

// if(require.main === module){
// 	app.listen(process.env.PORT || 4000, () => {
// 	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
// 	});
// }
	
module.exports = {app,mongoose};
