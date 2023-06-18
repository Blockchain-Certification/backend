import { DAC } from '../database/model';

import _ from 'lodash';

export const dacOmitDataTrash = (dac: DAC) => {
  const data = _.omit(dac, ['dispensingStatus', 'createdAt', 'updatedAt']);
  return data;
};

export const formatDateToString = (dac: any) => {
  (dac.dateOfBirth = `${dac.dateOfBirth}`),
    (dac.dateOfIssuing = dac.dateOfIssuing.toString()),
    (dac.createdAt = dac.createdAt.toString()),
    (dac.updatedAt = dac.updatedAt.toString());

  return dac;
};
