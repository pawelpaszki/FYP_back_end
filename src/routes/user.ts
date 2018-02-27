import * as express from 'express';
import UserController from '../controllers/userController';

const user = express.Router();

user.post('/register', UserController.register);
user.post('/login', UserController.login);
user.delete('/users', UserController.deleteAll);
user.get('/logout', UserController.logout);

export default user;