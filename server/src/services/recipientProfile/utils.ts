import { DAC } from '../../shared/database/model';

export const hasDuplicateAndMusDuplicateIU = (students: DAC[]): boolean => {
  const iUs = new Set<string>();
  const infoSt = new Set<string>();
  
  let count = 0;
  for (const student of students) {
    const { iU, iSt, id } = student;
    if (infoSt.has(iSt) || iUs.has(iSt) || infoSt.has(iU) ||  infoSt.has(id)) {
      return true;
    }
    if (count > 0 && !iUs.has(iU)) return true;
    iUs.add(iU);
    infoSt.add(iSt);
    infoSt.add(id);
    count++;
  }
  return false;
};
