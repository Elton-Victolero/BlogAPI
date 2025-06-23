// [SECTION] Dependencies and Modules
const bcrypt = require("bcrypt");
const auth = require('../auth.js');
const User = require("../models/Users.js");

// [SECTION] User Registration
module.exports.registerUser = (req, res) => {
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10)
    });
    if(!newUser.email || !newUser.email.includes("@")){
        return res.status(400).send({error:"Email invalid"});
    }else if(!req.body.password || req.body.password.length<8){
        return res.status(400).send({error:"Password must be at least 8 characters"});
    }else{
        return newUser.save()
        .then((result) => res.status(201).send({message:"Registered Successfully"}))
        .catch(error => errorHandler(error, req, res));
    }
};

// [SECTION] User authentication
module.exports.loginUser = (req, res) => {
    if(req.body.email.includes("@")){
        return User.findOne({ email: req.body.email })
        .then(result => {
            if(result === null) {
               return res.status(404).send({message:"No Email Found"});
            }else{
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                console.log(isPasswordCorrect);
                if(isPasswordCorrect) {                
                    return res.status(200).send({message:"User logged in successfully",access:auth.createAccessToken(result)});
                }else{
                    return res.status(401).send({message:"Email and password do not match"});
                }
            }
        }).catch(error => errorHandler(error, req, res)) 
    }else{
    return res.status(400).send({message:"Invalid Email"});
    }    
}

//[SECTION] get-user-details
module.exports.getUserDetails = (req, res) => {
    return User.findById(req.user.id)
    .then(user => {
        if(user === null){
            return res.status(404).send({message:"User not found"});
        }else{
            user.password = "";
            return res.status(200).send(user);
        }        
    })
    .catch(error => errorHandler(error, req, res));
};


// update-user-profile
module.exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const updates = {};

  if (req.body.username !== undefined) updates.username = req.body.username;
  if (req.body.profileImage !== undefined) updates.profileImage = req.body.profileImage;

  User.findByIdAndUpdate(userId, updates, { new: true })
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          profileImage: updatedUser.profileImage,
          isAdmin: updatedUser.isAdmin
        }
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Failed to update profile' });
    });
};
