import {
  InfoUserRepository,
  UserRepository,
} from '../../../shared/database/repository';
import { Role, User } from '../../../shared/database/model';
import { Types } from 'mongoose';
import { DACRepository } from '../../../shared/database/repository/dac.repository';
import { PaginationSearch, Pagination } from './interface';
export class UniversityService {
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

  public async getList(pagination: Pagination): Promise<User[]> {
    return await this.infoUserRepository.findInfoAndAccountFromUniversity(
      pagination,
    );
  }

  public async detail(id: Types.ObjectId): Promise<any> {
    return this.infoUserRepository.findByIdAndAccountUserFromUniversity(id);
  }

  public async search(paginationSearch: PaginationSearch): Promise<any> {
    return this.infoUserRepository.findInfoAndAccountFromKeyWordOfRoleUniversity(
      paginationSearch,
    );
  }

  public async count(): Promise<number> {
    return await this.userRepository.countFromUniversity();
  }
}
