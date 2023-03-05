import { User } from '../model';
import Keystore, { KeystoreModel } from '../model/KeyStore';
import { Types } from 'mongoose';
export class KeyStoreRepository {
  public async findforKey(client: User, key: string): Promise<Keystore | null> {
    return KeystoreModel.findOne({
      client: client,
      primaryKey: key,
      status: true,
    })
      .lean()
      .exec();
  }

  public async create(
    client: User,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore | null> {
    const keyStore = await KeystoreModel.create({
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
    });
    return keyStore.toObject();
  }

  public async find(
    client: User,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore | null> {
    return KeystoreModel.findOne({
      client: client,
      primaryKey: primaryKey,
      secondaryKey: secondaryKey,
    })
      .lean()
      .exec();
  }

  public async remove(id: Types.ObjectId): Promise<Keystore | null> {
    return KeystoreModel.findByIdAndRemove(id).lean().exec();
  }
}
