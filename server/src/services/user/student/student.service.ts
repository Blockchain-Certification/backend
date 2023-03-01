import {
  InfoUserRepository,
  UserRepository,
} from '../../../shared/database/repository';
import { Role, User } from '../../../shared/database/model';
import { Types } from 'mongoose';
import {  BadRequestError } from '../../../shared/core/apiError';
import { DACRepository } from '../../../shared/database/repository/dac.repository';
import { Pagination } from '../../recipientProfile/recipientProfile.service';
export interface argsGetList {
  page: number;
  limit: number;
  filter?: string;
}
export class StudentService {
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

  public async getList(pagination : Pagination, idUni : Types.ObjectId ): Promise<User[]> {
    return await this.infoUserRepository.findInfoAndAccountOfStudent(
      pagination,idUni
    );
  }

  public async edit(id: Types.ObjectId, data: any): Promise<any[]> {
    const user = await this.infoUserRepository.findByIdAndAccountUser(id);
    if (!user) throw new BadRequestError('User  not exist');
    await this.checkUpBlockchain(user.idUser.roles, user.identity);
    await this.infoUserRepository.edit(id, data);
    return await this.infoUserRepository.findByIdAndAccountUser(id);
  }

  public async delete(id: Types.ObjectId): Promise<void> {
    const user = await this.infoUserRepository.findByIdAndAccountUser(id);
    if (!user) throw new BadRequestError('User  not exist');
    await this.checkUpBlockchain(user.idUser.roles, user.identity);
    await this.infoUserRepository.delete(id);
    await this.userRepository.delete(user.idUser);
  }

  public async detail(id: Types.ObjectId): Promise<any> {
    return this.infoUserRepository.findByIdAndAccountUserOfStudent(id);
  }

  private async checkUpBlockchain(
    roles: Role[],
    identity: string,
  ): Promise<void> {
    if (roles.includes(Role.UNIVERSITY))
      throw new BadRequestError('University cannot delete');
    const isExistedDACStudent = await this.dacRepository.findByIStudent(
      identity,
    );
    if ( isExistedDACStudent &&isExistedDACStudent?.length > 0)
      throw new BadRequestError('User have up blockchain or on CERTIFICATES');
  }
}
