import {
  UserRepository,
  InfoUserRepository,
} from '../../shared/database/repository';
import { User, Role, Gender } from '../../shared/database/model';
import { BadRequestError } from '../../shared/core/apiError';
import bcrypt from 'bcrypt';
import { registerUser } from '../../shared/fabric/enrollment';
import { Types } from 'mongoose';
import { invokeChaincode } from '../../shared/fabric/chaincode';
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

    const promises: Promise<void>[] = [];
    await Promise.all(
      listUser.map(async (user: newUser) => {
        promises.push(this.createUser(user));
      }),
    ).catch((err) => {
      throw new BadRequestError(err);
    });
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

    const keys = await registerUser(infoUser.identity);
    user.publicKey = keys.publicKey;

    const checkRegisterUNI = await user.roles.filter(
      (role) => Role.DOET === role || Role.UNIVERSITY === role,
    ); // CHECK REGISTER  SHOULD DOET OR UNIVERSITY WILL REGISTER UP BLOCKCHAIN

    if (checkRegisterUNI.length > 0) {
      const argsCallFunction = {
        func: 'registerUniversity',
        args: [infoUser.name, user.publicKey, infoUser.address],
        isQuery: false,
        identity: infoUser.identity,
      };
      await invokeChaincode(argsCallFunction);
    }

    const passwordHash = await bcrypt.hash(user.password, 12);
    user.password = passwordHash;

    const createdUser = await this.userRepository.create(user as User);
    infoUser.idUser = createdUser._id;
    await this.infoUserRepository.create(infoUser);
  }

  private async checkRegister({
    userName,
    email,
    identity,
    phone,
  }: newUser): Promise<void> {
    const userExisted = await this.userRepository.findByName(userName);
    if (userExisted) throw new BadRequestError('User exists already');

    const identityExisted = await this.infoUserRepository.findByIdentity(
      identity,
    );

    if (identityExisted) throw new BadRequestError('Identity exists already');

    const emailExisted = await this.infoUserRepository.findByEmail(email);
    if (emailExisted) throw new BadRequestError('Email already exists');

    const phoneExisted = await this.infoUserRepository.findByPhone(phone);
    if (phoneExisted) throw new BadRequestError('Phone already exists');
  }

  private hasDuplicate(users: newUser[]): boolean {
    const seenFields = new Set<string>();

    for (const { userName, email, phone, identity } of users) {
      if (
        seenFields.has(userName) ||
        seenFields.has(email) ||
        seenFields.has(phone) ||
        seenFields.has(identity)
      ) {
        return true;
      }

      seenFields.add(userName);
      seenFields.add(email);
      seenFields.add(phone);
      seenFields.add(identity);
    }

    return false;
  }
}
