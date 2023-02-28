import { DAC } from '../../shared/database/model';

export const hasDuplicateAndMusDuplicateIU = (students: DAC[]): boolean => {
  const iUs = new Set<string>();
  const iSts = new Set<string>();
  let count = 0;
  for (const student of students) {
    const { iU, iSt } = student;
    if (iSts.has(iSt) || iUs.has(iSt) || iSts.has(iU)) {
      return true;
    }
    if (count > 0 && !iUs.has(iU)) return true;
    iUs.add(iU);
    iSts.add(iSt);
    count++;
  }
  return false;
};
