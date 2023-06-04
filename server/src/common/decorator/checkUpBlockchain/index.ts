import { TYPE_COURSE, TYPE_NAME_CERT, TYPE_YEAR } from '../../constant';
import { CheckCert } from './factoryCheck/checkCert';
import { CheckCourse } from './factoryCheck/checkCourse';
import { CheckYear } from './factoryCheck/checkYear';

class CheckUpBlockChainFactory {
  public createTypeCheckUpBlockchain(type: string) {
    switch (type) {
      case TYPE_COURSE:
        return new CheckCourse();
      case TYPE_NAME_CERT:
        return new CheckCert();
      case TYPE_YEAR:
        return new CheckYear();
    }
  }
}

export default new CheckUpBlockChainFactory();
