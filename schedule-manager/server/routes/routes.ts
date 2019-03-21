import { Router } from 'express';
import User from '../controllers/users';

class Routes {
    static activate() {
        return new this();
    }

    // defines /users routes
    users(): Router {
        const router = Router();
        router.post('/', User.addUser);             // add a user on this route
        router.get('/', User.getUsers);             // get users through this route
        router.delete('/:id', User.deleteUser);
        router.put('/', User.updateUser);
        return router;
    }
}

export default Routes;
