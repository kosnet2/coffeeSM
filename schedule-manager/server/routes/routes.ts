import { Router } from 'express';
import User from '../controllers/users';

class Routes {
    static activate() {
        return new this();
    }

    // defines /users routes
    users(): Router {
        const router = Router();
        router.post('/', User.addUser);     // add a user on this route
        return router;
    }
}

export default Routes;
