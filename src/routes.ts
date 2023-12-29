import express, {Request, Response} from 'express';
import { AuthController } from './controllers/AuthController'
import { UserController } from './controllers/UserController';
import { AccessTokenController } from './controllers/AccessTokenController';
import { authMiddleware } from './middlewares/auth';

const authController = new AuthController();
const userController = new UserController();
const accessTokenController = new AccessTokenController();

const routes = express.Router();

routes.get('/', (req: Request, res: Response) => {
    res.json({hello: "World"});
})

routes.post('/authenticate', authController.authenticate);

routes.use(authMiddleware);

routes.post('/addNewUser', userController.createUser);
routes.get('/users', userController.readUsers);
routes.get('/user/:user_id', userController.readUserById);
routes.delete('/user', userController.deleteUser);

routes.post('/addNewAccessToken', accessTokenController.addNewAccessToken);

export { routes };