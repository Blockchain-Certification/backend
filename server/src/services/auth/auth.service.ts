import {
  UserRepository,
  InfoUserRepository,
} from '../../shared/database/repository';
import { User, InfoUser, Role, Gender } from '../../shared/database/model';
import { BadRequestError } from '../../shared/core/apiError';
import bcrypt from 'bcrypt';
import { registerUser } from '../../shared/fabric/enrollment';
import { Types } from 'mongoose';
export interface newUser {
  userName: string;
  password: string;
  roles: Role[];
  name: string;
  phone: string;
  dateOfBirth: Date;
  gender: Gender;
  nation: string;
  address: string;
  identity: string;
  email: string;
}
export default class AuthService {
  private userRepository: UserRepository;
  private infoUserRepository: InfoUserRepository;
  constructor(
    userRepository: UserRepository,
    infoUserRepository: InfoUserRepository,
  ) {
    this.userRepository = userRepository;
    this.infoUserRepository = infoUserRepository;
  }

  public async register(listUser: newUser[]): Promise<void> {
    if (this.hasDuplicate(listUser)) {
      throw new BadRequestError(
        'Duplicate field in list . Check identity, userName, email, phone ',
      );
    }

    for (let i = 0; i < listUser.length; i++) {
      const user: newUser = listUser[i];
      await this.checkRegister(user);
    }

    const promises: any = [];
    await listUser.forEach(async (user: newUser) => {
      promises.push(this.createUser(user));
    });
    await Promise.all(promises);
  }

  private async createUser(newUser: newUser): Promise<any> {
    const [user, infoUser] = await Promise.all([
      (async () => ({
        userName: newUser.userName,
        password: newUser.password,
        roles: newUser.roles,
        publicKey: '',
      }))(),
      (async () => ({
        identity: newUser.identity,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        dateOfBirth: newUser.dateOfBirth,
        gender: newUser.gender,
        nation: newUser.nation,
        idUser: new Types.ObjectId(),
      }))(),
    ]);
    const permissionEnrollPulicKey = await user.roles.filter(
      (role) => Role.DOET === role || Role.UNIVERSITY === role,
    );
    if (permissionEnrollPulicKey.length > 0) {
      const keys = await registerUser(infoUser.identity);
      user.publicKey = keys.publicKey;
    }
    const passwordHash = await bcrypt.hash(user.password, 12);
    user.password = passwordHash;
    const createdUser = await this.userRepository.create(user as User);
    infoUser.idUser = createdUser._id;
    await this.infoUserRepository.create(infoUser);
  }

  private async checkRegister(user: newUser) {
    const userExisted = await this.userRepository.findByName(user.userName);
    if (userExisted) throw new BadRequestError('User exists already');

    const identityExisted = await this.infoUserRepository.findByIdentity(
      user.identity,
    );

    if (identityExisted) throw new BadRequestError('Identity exists already');

    const emailExisted = await this.infoUserRepository.findByEmail(user.email);
    if (emailExisted) throw new BadRequestError('Email already exists');

    const phoneExisted = await this.infoUserRepository.findByPhone(user.phone);
    if (phoneExisted) throw new BadRequestError('Phone already exists');
  }

  private hasDuplicate(users: newUser[]): boolean {
    const seenFields = new Set<string>();

    for (const user of users) {
      if (
        seenFields.has(user.userName) ||
        seenFields.has(user.email) ||
        seenFields.has(user.phone) ||
        seenFields.has(user.identity)
      ) {
        return true;
      }

      seenFields.add(user.userName);
      seenFields.add(user.email);
      seenFields.add(user.phone);
    }

    return false;
  }
}
