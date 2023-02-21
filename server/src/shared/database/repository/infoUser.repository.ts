import { InfoUser, InfoUserModel } from '../model';
export class InfoUserRepository {
  public async create(user: InfoUser): Promise<InfoUser> {
    return InfoUserModel.create(user);
  }
  public async findByIdentity(identity: string): Promise<string | undefined> {
    const user = await InfoUserModel.findOne({ identity });
    return user?.identity;
  }
  public async findByEmail(email: string): Promise<string | undefined> {
    const user = await InfoUserModel.findOne({ email });
    return user?.email;
  }
  public async findByPhone(phone: string): Promise<string | undefined> {
    const user = await InfoUserModel.findOne({ phone });
    return user?.phone;
  }
}
