const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserModel = require("../models/users");
const {authenticateJWT} = require('../middleware/authenticate');

router.get('/check', (req, res, next) => {
  res.status(200).json({
    message: 'API working',
    success: true,
  });
});

router.post('/register', async (req, res) => {
  const {signupUsername, signupPassword, email, confirmPassword} = req.body;

  if (!signupUsername || !signupPassword) {
      return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check if username already exists
  const userExists = await UserModel.find({username: signupUsername});


  if (userExists.length >= 1) {
      return res.status(400).json({ message: 'Username already taken.' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(signupPassword, 10);

  const newUser = new UserModel({
    username: signupUsername,
    email,
    password: hashedPassword,
  });

  newUser.save()
    .then(doc => {
    
      res.status(201).json({ success: true, message: 'User registered successfully.', username: signupUsername, password: hashedPassword });

    })
    .catch(err => {
      console.error('Error saving user:', err);
      res.status(400).json({success: false, message: 'Internal server error.'});
    });
});



// router.post('/login', (req, res, next) => {
//   const params = req.body;
//   const SECRET_KEY = 'z_oZc1nQJVXcaE_Z_Cs9815gnqBJLYYkYn6C_CgZ4hQ';

//   if(params.username === 'sidney' && params.password === 'bading') {
//     const payload = {username: params.username};

//     const token = jwt.sign(payload, SECRET_KEY, {'expiresIn': '1hr'});
//     res.json({success:true, token});
    
//   } else {
//     res.status(200).json({success: false, message: 'Invalid username or password' });
//   }
// });

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Find user
  const userExists = await UserModel.find({username: username});


  if (userExists.length == 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const user = userExists[0];

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.', success: false });
  }

  // Generate JWT
  console.log('JWT SECRET: ');
  console.log(process.env.JWT_SECRET);

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ message: 'access login', success: true, token });
});

router.post('/info',[authenticateJWT], async (req, res, next) => {
  const {username} = req.body;

  console.log('USERNAME: ');
  console.log(username);
 
  if (!username ) {
      return res.status(400).json({ message: 'Invalid Credential.', success: false });
  }

  // Find user
  const userExists = await UserModel.find({username: username});

  if (userExists.length == 0) {
      return res.status(401).json({ message: 'Invalid credentials.', success: false });
  }

  const user = userExists[0];
  res.status(200).json({success: true, message: 'access user data', userData: {username: user.username, email: user.email}});
});

router.post('/update', async (req, res, next) => {
  const {username, email} = req.body;
 
  if (!username || !email) {
      return res.status(400).json({ message: 'Invalid Data.', success: false });
  }
  // Update user
  const updateUser = await UserModel.updateOne({ username: username }, { username, email });

  if(updateUser.acknowledged) {
    res.status(200).json({success: true, message: 'User updated.'});
  } else {
    return res.status(400).json({ message: 'Error updating data.', success: false });
  }

});

module.exports = router;