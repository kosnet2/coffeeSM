import userSchema from '../models/user';
import * as mongoose from 'mongoose';


const userModel = mongoose.model('User', userSchema);

class Users {
    addUser(req, res){
        const userDoc = req.body;
        userModel.create(userDoc).then((response: any) => {
            return res.json({ user: response, message: 'User successfully added'});
        }).catch( err => {
            return res.status(400).json({ message: 'Database error: Could not add user', error: err });
        });
    }
}

export default new Users();
