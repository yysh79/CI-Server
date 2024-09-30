

import { Request, Response } from 'express';
import User from '../models/userModel'
import { log } from 'console';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        log(users);
        
        res.status(200).json(users);
    } catch (error) {
        log(error);
        
        res.status(500).json({ message: 'Failed to fetch users', error:error });
    }

  };
  
  