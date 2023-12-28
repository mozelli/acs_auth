import express, {Request, Response} from 'express';
import { AuthController } from './controllers/AuthController'
import { UserController } from './controllers/UserController';
import { AccessTokenController } from './controllers/AccessTokenController';

const authController = new AuthController();
const userController = new UserController();
const accessTokenController = new AccessTokenController();

const routes = express.Router();

routes.post('/authenticate', authController.authenticate);

routes.post('/addNewUser', userController.createUser);
routes.get('/user/:user_id', userController.readUser);
routes.delete('/user', userController.deleteUser);

routes.post('/addNewAccessToken', accessTokenController.addNewAccessToken);

export { routes };