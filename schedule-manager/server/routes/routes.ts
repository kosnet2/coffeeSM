import { Router } from 'express';
import User from '../controllers/users';
import Schedule from '../controllers/schedules';


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

    // defines /users routes
    schedules(): Router {
        const router = Router();
        router.post('/', Schedule.addSchedule);             // add a schedule on this route
        router.get('/', Schedule.getSchedules);             // get schedules through this route
        router.delete('/:id', Schedule.deleteSchedule);
        router.put('/', Schedule.updateSchedule);
        return router;
    }

}

export default Routes;
