import { ArgsFunctionCallChainCode } from '../chaincode';

export default {
  queryUniversityProfileByName: (
    universityName: string,
    identityUniversity: string,
  ): ArgsFunctionCallChainCode => {
    return {
      func: 'queryUniversityProfileByName',
      args: [universityName],
      isQuery: true,
      identity: identityUniversity,
    };
  },
  getAllCertificateByUniversity: (
    publicKey: string,
    identityUniversity: string,
  ): ArgsFunctionCallChainCode => {
    return {
      func: 'getAllCertificateByUniversity',
      args: [publicKey],
      isQuery: true,
      identity: identityUniversity,
    };
  },
  getAllCertificateByStudent: (
    publicKey: string,
    identity: string,
  ): ArgsFunctionCallChainCode => {
    return {
      func: 'getAllCertificateByStudent',
      args: [publicKey],
      isQuery: true,
      identity,
    };
  },
  queryCertificateSchema: (identity: string): ArgsFunctionCallChainCode => {
    return {
      func: 'queryCertificateSchema',
      args: ['v1'],
      isQuery: true,
      identity
    };
  },
};
