import { fieldDefault } from './constant';
export const paramsToShareAddFieldNeedShareDefault = (
  paramsToShare: string[],
): string[] => {
  return paramsToShare.concat(fieldDefault);
};
