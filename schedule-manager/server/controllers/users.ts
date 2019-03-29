import userSchema from '../models/user';
import * as mongoose from 'mongoose';


const userModel = mongoose.model('User', userSchema);

class Users {

    /* Add user to database */
    addUser(req, res) {
        const userDoc = req.body;
        userModel.create(userDoc).then((response: any) => {
            return res.json({ user: response, message: 'User successfully added'});
        }).catch( err => {
            return res.status(400).json({ message: 'Database error: Could not add user', error: err });
        });
    }

    /* Get list of all the users from the database */
    getUsers(req, res) {
        userModel.find().then((users: any) => {
            return res.json(users);

        }).catch(err => {
            return res.status(400).json({
                message: 'Database error: Could not get user',
                error: err
            });
        });
    }

    /* Delete the specified user from the database */
    deleteUser(req, res) {
        const id = req.params.id;

        userModel.deleteOne( { '_id': id}).then((response: any) => {
            if (response.deletedCount) {
                return res.json({
                    success: true,
                    message: 'User successfully deleted'
                });
            } else {
                return res.json({
                    success: false,
                    message: 'User does not exist'
                });
            }
        }).catch(err => {
            return res.status(400).json({
                message: 'Database error: Could not delete user',
                error: err
            });
        });
    }

    /* Update a specific user. The whole user object is passed but the _id is used to identify the proper document*/
    updateUser(req, res) {
        const userDoc = req.body;

        userModel.updateOne({_id: userDoc._id }, userDoc).then( response => {
            if (response.n) {
                return res.json({
                    success: true,
                    message: response.nModified ? 'User successfully updated' : 'User is the same',
                    user: userDoc
                });
            } else {
                return res.json({
                    success: false,
                    message: 'User does not exist'
                });
            }
        }).catch(err => {
            return res.status(400).json({
                message: 'Database error: Could not update user',
                error: err
            });
        });
    }
}

export default new Users();
