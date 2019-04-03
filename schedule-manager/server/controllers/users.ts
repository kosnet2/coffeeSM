import userSchema from '../models/user';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

const userModel = mongoose.model('User', userSchema);

class Users {

    /* Add user to database */
    addUser(req, res) {
        const userDoc = req.body;
        bcrypt.hash(userDoc.password, 10, (_, hash) => {
            userDoc.password = hash;
            userModel.create(userDoc).then((response: any) => {
                return res.json({ user: response, message: 'User successfully added'});
            }).catch( err => {
                return res.status(400).json({ message: 'Database error: Could not add user', error: err });
            });
        });
    }


  
    /* Update a specific user. The whole user object is passed but the _id is used to identify the proper document*/
    updateUser(req, res) {
        const userDoc = req.body;
        bcrypt.hash(userDoc.password, 10, (_, hash) => {
            userDoc.password = hash;
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
        });
    }


    /* Updates a specific users unavailability data */
    updateUserUnavailability(req, res) {
        const userDoc = req.body;
        if (userDoc.password) {
            delete userDoc.password;
        }
        userModel.updateOne({_id: userDoc._id }, {$set: userDoc}).then(response => {
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

    /* Login functionality, given email & password find entry in db & on success return the user with the hashed password */
    login(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        userModel.findOne({ email: email }).then((userDoc: any) => {
            if (!userDoc) {
                return res.status(404).json({
                    success: false,
                    message: 'Email does not exist'
                });
            }

            bcrypt.compare(password, userDoc.password, (_, success) => {
                if (success) {
                    const token = jwt.sign({ email: email }, config.jwt_secret, {
                        expiresIn: '12h' // expires in 12 hours
                    });

                    // Don't send password for security
                    userDoc.password = '--removed--';
                    return res.json({
                        success: true,
                        message: 'User logged in',
                        user: userDoc,
                        jwt_token: token
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: 'Password is incorrect'
                });
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

}

export default new Users();
