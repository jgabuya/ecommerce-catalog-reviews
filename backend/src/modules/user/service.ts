import { Store } from './store';
import { User, CreateUserPayload, UserResponse } from './types';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';

export interface UserServiceInterface {
  login(email: string, password: string): Promise<UserResponse>;
  register(user: CreateUserPayload): Promise<UserResponse>;
  findById(id: string): Promise<User | null>;
}

export class UserService {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  async login(email: string, password: string): Promise<UserResponse> {
    const user = await this.store.findByEmail(email);

    if (!user) {
      throw new Error('Cannot find user');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    return omit(user, 'password');
  }

  async register(user: CreateUserPayload): Promise<UserResponse> {
    user.password = bcrypt.hashSync(user.password, 10);
    const newUser = await this.store.create(user);

    return omit(newUser, 'password');
  }

  async findById(id: string) {
    return await this.store.findById(id);
  }
}
