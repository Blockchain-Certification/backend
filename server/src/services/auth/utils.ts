import _ from 'lodash';
import { User } from '../../shared/database/model';

export async function getUserData(user: User) {
  const data = _.pick(user, ['_id', 'userName', 'roles']);
  return data;
}
