import {
  UserRepository,
  InfoUserRepository,
  KeyStoreRepository,
} from '../../shared/database/repository';
import { User, Role, Gender } from '../../shared/database/model';
import { BadRequestError, AuthFailureError } from '../../shared/core/apiError';
import crypto from 'crypto';
import { registerUser } from '../../shared/fabric/enrollment';
import { Types } from 'mongoose';
import { invokeChaincode } from '../../shared/fabric/chaincode';
import { getUserData } from './utils';
import { MailNodeMailerProvider } from '../../shared/helpers/mailer/nodemailer';
import { register } from '../../shared/helpers/mailer/html/register';
import {
  createTokens,
  validateTokenData,
} from '../../shared/helpers/jwt.utils';
import { Tokens } from '../../shared/types/app-request';
import JWT from '../../shared/core/JWT';
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

export interface userLogin {
  userName: string;
  password: string;
}
export default class AuthService {
  private userRepository: UserRepository;
  private infoUserRepository: InfoUserRepository;
  private keyStoreRepository: KeyStoreRepository;
  private readonly mailNodeMailerProvider: MailNodeMailerProvider;

  constructor(
    userRepository: UserRepository,
    infoUserRepository: InfoUserRepository,
    keyStoreRepository: KeyStoreRepository,
    mailNodeMailerProvider: MailNodeMailerProvider,
  ) {
    this.userRepository = userRepository;
    this.infoUserRepository = infoUserRepository;
    this.keyStoreRepository = keyStoreRepository;
    this.mailNodeMailerProvider = mailNodeMailerProvider;
  }

  public async login({ userName, password }: userLogin) {
    const user = await this.userRepository.findByUserName(userName);
    if (!user) throw new BadRequestError('User does not exist');

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) throw new AuthFailureError('Invalid password');

    const tokens = await this.createTokens(user);
    const userData = await getUserData(user);

    return {
      tokens,
      userData,
    };
  }

  public async logout(id: Types.ObjectId): Promise<void> {
    this.keyStoreRepository.remove(id);
  }
  public async refreshToken({
    accessToken,
    refreshToken,
  }: Tokens): Promise<Tokens> {
    const accessTokenPayload = await JWT.decode(accessToken);
    validateTokenData(accessTokenPayload);

    const user = await this.userRepository.findById(accessTokenPayload.sub);
    if (!user) throw new AuthFailureError('User not registered');

    const refreshTokenPayload = await JWT.decode(refreshToken);
    await validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub)
      throw new AuthFailureError('Invalid access token');

    const keystore = await this.keyStoreRepository.find(
      user,
      accessTokenPayload.prm,
      refreshTokenPayload.prm,
    );

    if (!keystore) throw new AuthFailureError('Invalid access token');
    await this.keyStoreRepository.remove(keystore._id);

    const tokens = await this.createTokens(user);

    return tokens;
  }

  public async register(
    listUser: newUser[],
    createdBy: Types.ObjectId,
  ): Promise<any> {
    if (this.hasDuplicate(listUser)) {
      throw new BadRequestError(
        'Duplicate field in list . Check identity, userName, email, phone ',
      );
    }

    for (const element of listUser) {
      const user: newUser = element;
      await this.checkRegister(user);
    }
    await listUser.forEach(async (user: newUser) => {
      return await this.createUser(user, createdBy);
    });

    return listUser;
  }

  private async createTokens(user: User): Promise<Tokens> {
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await this.keyStoreRepository.create(user, accessTokenKey, refreshTokenKey);
    return await createTokens(user, accessTokenKey, refreshTokenKey);
  }

  private async createUser(
    newUser: newUser,
    createdBy: Types.ObjectId,
  ): Promise<any> {
    const user = (({ userName, password, roles }) => ({
      userName,
      password,
      roles,
      publicKey: '',
    }))(newUser);

    const checkRegisterUNI = await user.roles.includes(Role.UNIVERSITY);

    const infoUser = (({
      identity,
      name,
      email,
      phone,
      address,
      dateOfBirth,
      gender,
      nation,
    }) => ({
      identity,
      name,
      email,
      phone,
      address,
      dateOfBirth: checkRegisterUNI ? null : dateOfBirth,
      gender,
      nation: checkRegisterUNI ? null : nation,
      createdBy: checkRegisterUNI ? null : createdBy,
      idUser: new Types.ObjectId(),
    }))(newUser);

    // register blockchain wallet
    const keys = await registerUser(infoUser.identity);
    user.publicKey = keys.publicKey;

    // CHECK REGISTER  have UNIVERSITY WILL REGISTER UP BLOCKCHAIN
    if (checkRegisterUNI) {
      const argsCallFunction = {
        func: 'registerUniversity',
        args: [infoUser.name, user.publicKey, infoUser.address],
        isQuery: false,
        identity: infoUser.identity,
      };
      await invokeChaincode(argsCallFunction);
    }

    // create user
    const createdUser = await this.userRepository.create(user as User);
    infoUser.idUser = createdUser._id;
    const createdInfo = await this.infoUserRepository.create(infoUser);

    // send mail
    await this.mailNodeMailerProvider.sendEmail({
      to: {
        name: createdInfo.name,
        email: createdInfo.email,
      },
      subject: 'Đăng ký Tài Khoản HUFLIT-VBCC',
      body: register({
        userName: createdUser.userName,
        password: user.password,
        name: createdInfo.name,
      }),
    });
    return await this.infoUserRepository.findByIdAndAccountUser(
      createdInfo._id as Types.ObjectId,
    );
  }

  private async checkRegister({
    userName,
    email,
    identity,
    phone,
  }: newUser): Promise<void> {
    const userExisted = await this.userRepository.findByUserName(userName);
    if (userExisted)
      throw new BadRequestError(`User exists already : ${userName}`);

    const identityExisted = await this.infoUserRepository.findByIdentity(
      identity,
    );

    if (identityExisted)
      throw new BadRequestError(`Identity exists already ${identity}`);

    const emailExisted = await this.infoUserRepository.findByEmail(email);
    if (emailExisted)
      throw new BadRequestError(`Email already exists ${email}`);

    const phoneExisted = await this.infoUserRepository.findByPhone(phone);
    if (phoneExisted)
      throw new BadRequestError(`Phone already exists ${phone}`);
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
