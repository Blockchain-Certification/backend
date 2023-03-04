import argsCallFunc from './config';
import { invokeChaincode } from '../chaincode';
export const queryUniversityProfileByName = async (
  nameUni : string,
  identityUniversity : string,
) => {
  const func = await argsCallFunc.queryUniversityProfileByName(
    nameUni,
    identityUniversity,
  );
  return await invokeChaincode(func);
};


export const getAllCertificateByUniversity = async (publicKey : string, identityUniversity : string) => {
  const func = await argsCallFunc.getAllCertificateByUniversity(
    publicKey,
    identityUniversity,
  );
  return await invokeChaincode(func);
}

export const getAllCertificateByStudent = async (publicKey : string, identity : string) => {
  const func = await argsCallFunc.getAllCertificateByStudent(
    publicKey,
    identity,
  );
  return await invokeChaincode(func);
}