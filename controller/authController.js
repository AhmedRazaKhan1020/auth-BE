import authModel from '../models/Auth.model.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    try {
        const { name, phone, address, email, password, role } = req.body;
        const newUser = new authModel({ name, phone, address, email, password, role: role || 0 });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

 const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authModel.findOne({ email, password });  
        if(user.role === 1){
              //create token
            const token =  jwt.sign({ _id: user._id }, "cadetahmed2008", {
                expiresIn: "7d",
            });
            res.status(200).json({ message: 'Admin Login successful',
                user: { id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address },
                token
            });
        }else if (user) {
            res.status(200).json({ message: 'Login successful',
                user: { id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role },
            });
            localStorage.setItem("token", token);
        }
         else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
// const authController = mongoose.model('authController', authModel);
export {register, login};