import { Router } from 'express';
import User from '../controllers/users';

class Routes {
    static activate() {
        return new this();
    }

    /**
     * Defines /users routes
     */
    users(): Router {
        const router = Router();
        router.post('/', User.addUser);
        return router;
    }
}

export default Routes;
