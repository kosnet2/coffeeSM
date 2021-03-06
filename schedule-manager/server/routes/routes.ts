import { Router } from 'express';
import User from '../controllers/users';
import Schedule from '../controllers/schedules';
import Positions from '../controllers/positions';
import config from '../config/config';
import * as jwt from 'jsonwebtoken';


class Routes {
    static activate() {
        return new this();
    }

    /* Check if token is authorized based on secret key */
    checkToken(req, res, next) {
        const token = req.headers['authorization'];
        if (token) {
            jwt.verify(token, config.jwt_secret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Auth token is not valid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(401).json({ message: 'Auth token is not supplied' });
        }
    }

    // defines /users routes
    users(): Router {
        const router = Router();
        router.post('/login', User.login);          // Log in user
        router.post('/', User.addUser);             // add a user on this route
        router.get('/', User.getUsers);             // get users through this route
        router.delete('/:id', User.deleteUser);
        router.put('/', User.updateUser);
        router.put('/unavailability', User.updateUserUnavailability);
        return router;
    }

    // defines /users routes
    schedules(): Router {
        const router = Router();
        router.post('/', Schedule.addSchedules);             // will call insertMany function
        router.get('/:range', Schedule.getScheduleRange);    // get schedules through this route
        router.put('/', Schedule.updateSchedule);
        router.put('/remove', Schedule.removeUserFromSchedule);
        return router;
    }

   
    
     positions(): Router {
        const router = Router();
        router.get('/', Positions.getPositions);        // get positions
        router.put('/', Positions.updatePositions);     // update positions
        return router;
        }

}

export default Routes;
