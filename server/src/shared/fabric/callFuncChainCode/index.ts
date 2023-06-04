import argsCallFunc from './config';
import { invokeChaincode } from '../chaincode';
export const queryUniversityProfileByName = async (
  nameUni: string,
  identityUniversity: string,
) => {
  const func = await argsCallFunc.queryUniversityProfileByName(
    nameUni,
    identityUniversity,
  );
  return await invokeChaincode(func);
};

export const getAllCertificateByUniversity = async (
  publicKey: string,
  identityUniversity: string,
) => {
  const func = await argsCallFunc.getAllCertificateByUniversity(
    publicKey,
    identityUniversity,
  );
  return await invokeChaincode(func);
};

export const getAllCertificateByStudent = async (
  publicKey: string,
  identity: string,
) => {
  const func = await argsCallFunc.getAllCertificateByStudent(
    publicKey,
    identity,
  );
  return await invokeChaincode(func);
};

export const queryCertificateSchema = async (identity: string) => {
  const func = await argsCallFunc.queryCertificateSchema(identity);
  return await invokeChaincode(func);
};


export const getAllCertificatesByCourse = async (
  course: string,
  identity: string,
) => {
  const func = await argsCallFunc.getAllCertificatesByCourse(
    course,
    identity,
  );
  return await invokeChaincode(func);
};


export const getAllCertificatesByYear = async (
  year: string,
  identity: string,
) => {
  const func = await argsCallFunc.getAllCertificatesByYear(
    year,
    identity,
  );
  return await invokeChaincode(func);
};



export const getAllCertificatesByNameCertificate = async (
  nameCertificate: string,
  identity: string,
) => {
  const func = await argsCallFunc.getAllCertificatesByNameCertificate(
    nameCertificate,
    identity,
  );
  return await invokeChaincode(func);
};