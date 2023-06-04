import { ArgsFunctionCallChainCode } from '../chaincode';
import { queryCertificateSchema } from './index';

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
  getAllCertificatesByCourse: (
    course: string,
    identity: string,
  ): ArgsFunctionCallChainCode => {
    return {
      func: 'getAllCertificatesByCourse',
      args: [course],
      isQuery: true,
      identity,
    };
  },
  getAllCertificatesByYear: (
    year: string,
    identity: string,
  ): ArgsFunctionCallChainCode => {
    return {
      func: 'getAllCertificatesByYear',
      args: [year],
      isQuery: true,
      identity,
    };
  },
  getAllCertificatesByNameCertificate: (
    nameCertificate: string,
    identity: string,
  ): ArgsFunctionCallChainCode => {
    return {
      func: 'getAllCertificatesByNameCertificate',
      args: [nameCertificate],
      isQuery: true,
      identity,
    };
  },
  queryCertificateByUUID: (
    idDAC: string,
    identity: string,
  ): ArgsFunctionCallChainCode => {
    return {
      func: 'queryCertificateByUUID',
      args: [idDAC],
      isQuery: true,
      identity: identity,
    };
  },
  
};
