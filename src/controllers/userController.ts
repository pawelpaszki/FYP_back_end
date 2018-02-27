import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import {User,
} from '../models/user';

class UserController {

  public register = async (req: Request, res: Response) => {
    try {
      const hashedPassword = bcrypt.hashSync(req.body.password, 8);
      const newUser = new User();
      newUser.username = req.body.username;
      newUser.password = hashedPassword;
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.SECRET || 'secret', {
        expiresIn: 3600, // 1 hour
      });
      res.status(200).json({
        token,
      });
    } catch (err) {
      return res.status(403).json({
        token: null,
      });
    }
  }

  public login = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({username: req.body.username}).exec();
      if (user !== null) {
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
          return res.status(401).send({token: null});
        }
        const token = jwt.sign({
          id: user._id,
        }, process.env.SECRET || 'secret', {
          expiresIn: 3600,
        });
        res.status(200).json({
          token,
        });
      } else {
        return res.status(404).json({
          error: 'Unable to find ' + req.body.username,
        });
      }
    } catch (err) {
      return res.status(403).json({
        error: 'Unable to login',
      });
    }
  }

  public deleteAll = async (req: Request, res: Response) => {
    await User.deleteMany({});
    return res.status(200).json({message: 'All users deleted successfully'});
  }

  public logout = async (req: Request, res: Response) => {
    return res.status(200).json({
      token: null,
    });
  }
}

export default new UserController();
