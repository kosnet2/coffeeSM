/*
*   The server routes
*/
import { Router } from 'express';
import User from '../controllers/users';
import Positions from '../controllers/positions';

class Routes {
    static activate() {
        return new this();
    }

    // defines /users routes
    users(): Router {
        const router = Router();
        router.post('/', User.addUser);             // add a user on this route
        router.get('/', User.getUsers);             // get users through this route
        router.delete('/:id', User.deleteUser);     // delete specified user
        router.put('/', User.updateUser);           // update users
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
