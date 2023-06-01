import _ from 'lodash';
import { User } from '../../shared/database/model';
import InfoUser from '../../shared/database/model/InfoUser';

export async function getUserData(user: User, infoUser: InfoUser ) {
  const data = _.pick(user, ['_id', 'userName', 'roles']);
  const dataInfo = _.pick(infoUser, ['name', 'email', 'phone', 'address']);
  return {
    ...data,
    ...dataInfo
  };
}
