import { DAC } from "../database/model";

import _ from 'lodash';

export const dacOmitDataTrash = (dac: DAC) => {
  const data = _.omit(dac, ['dispensingStatus', 'createdAt', 'updatedAt']);
  return data;
};
