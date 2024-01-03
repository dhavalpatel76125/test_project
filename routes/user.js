const { Router } = require("express");
const router = Router(); // For sending reset emails
const { authenticateToken } = require('../Services/authorization');
const UserController = require("../Controller/UserController");
//const authenticateToken = require('../Services/authorization')
// Registration Route

router.post("/register", UserController.register);

router.post("/login", UserController.LoginUser);

router.post("/forgot-password", UserController.ForgotPassword);

router.post('/api/reset-password', UserController.resetPassword);

router.get('/user' ,authenticateToken, UserController.getUserById)


// Router.post('/register', async (req, res) => {
//     try {
//       const { email, phone, password, inviteCode } = req.body;
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       const user = new User({ email, phone, password: hashedPassword, inviteCode });
//       await user.save();
  

//       res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Error registering user' });
//     }
//   });





// // Login Route
// Router.post('/login', async (req, res) => {
//   try {
//     const { email, phone, password } = req.body;

//     const user = await User.findOne({ $or: [{ email }, { phone }] });
//     if (!user) {
//       return res.status(401).json({ error: 'Authentication failed' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Authentication failed' });
//     }

//     const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
//     res.status(200).json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error logging in' });
//   }
// });



module.exports = router
