import {
  InfoUserRepository,
  UserRepository,
} from '../../shared/database/repository';
import { User } from '../../shared/database/model';
import { Types } from 'mongoose';
import { InternalError, BadRequestError } from '../../shared/core/apiError';
import { DACRepository } from '../../shared/database/repository/dac.repository';
export interface argsGetList {
  page: number;
  limit: number;
  filter?: string;
}
export class UserService {
  private infoUserRepository: InfoUserRepository;
  private userRepository: UserRepository;
  private dacRepository: DACRepository;
  constructor(
    infoUserRepository: InfoUserRepository,
    userRepository: UserRepository,
    dacRepository: DACRepository,
  ) {
    this.infoUserRepository = infoUserRepository;
    this.userRepository = userRepository;
    this.dacRepository = dacRepository;
  }

  public async getList(args: argsGetList): Promise<User[]> {
    if (args.filter !== undefined) {
      return await this.infoUserRepository.findByRole(args);
    }
    return await this.infoUserRepository.findInfoAndAccount(
      args.page,
      args.limit,
    );
  }

  public async edit(id: Types.ObjectId, data: any): Promise<any[]> {
    await this.infoUserRepository.edit(id, data);
    return await this.infoUserRepository.findByIdAndAccountUser(id);
  }

  public async delete(id: Types.ObjectId): Promise<void> {
    const user = await this.infoUserRepository.findById(id);
    if (!user) throw new BadRequestError('User  not exist');
    const findIStudent = await this.dacRepository.findByIStudent(user.identity);
    const findIUni = await this.dacRepository.findByIUni(user.identity);
    const existedDAC = findIStudent || findIUni ;
    if (existedDAC) throw new BadRequestError('User have up blockchain');
    await this.infoUserRepository.delete(id);
    await this.userRepository.delete(user.idUser);
  }
}
