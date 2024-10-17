import z from "zod"
import User from "../models/user.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSignupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
    
  });

  const userLoginSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  });

  const userSignup = async (req, res) => {
    const { name, email, password } = req.body;
    const result = userSignupSchema.safeParse(req.body);

    if(!result.success) {
        res.status(401)
         .json(
            {message : result.error.issues}
         )
    }
    try {
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      const token = jwt.sign(
        { id: newUser._id, name: newUser.name },
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );

      const {password : pass, ...currUser} = newUser._doc
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        partitioned : true,
        maxAge: 24 * 60 * 60 * 1000 
      };

      res
      .status(200)
      .cookie('access_token', token , options)
      .json({ message: 'Signup successful' , user : currUser });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };


  const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const result = userLoginSchema.safeParse(req.body);

    if(!result.success) {
        console.log(result.error.issues)
        res.status(401)
         .json(
            {message : result.error.issues}
         )
    }
    try {
      
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found -- ")
        return res.status(400).json({ message: 'User not found' });
      }
  

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
   
      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
       

      const {password : pass, ...currUser} = user._doc;
      // console.log("userdata on login" ,currUser);
      
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        partitioned : true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
      };
  
      res
      .status(200)
      .cookie('access_token', token , options)
      .json({ message: 'Login successful' , user : currUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const logout = (req, res) => {
    try {
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        partitioned : true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
      };
      
      res.clearCookie('access_token', options)
          .status(200)
          .json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


  const getUserDetails = async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error retrieving user details', error });
    }
  };

  export {
    userLogin,
    userSignup,
    logout,
    getUserDetails
  }