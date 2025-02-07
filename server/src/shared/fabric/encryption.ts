import MerkleTree from 'merkletreejs';
import * as crypto from 'crypto-js';
import { invokeChaincode } from './chaincode';
import { loadHexKeysFromWallet } from './wallet-utils';
import { queryCertificateByUUID, queryCertificateSchema } from './callFuncChainCode';
import { KJUR } from 'jsrsasign';
import { InfoProof } from '../../services/dac/student/interfaces';
import { DAC } from '../database/model';
import { VerifyProof } from '../../services/dac/general/interface';
import { fabric } from '../../config';
import { ADMIN_ID, DATE_OF_BIRTH, DATE_OF_ISSUING } from '../../common/constant';
import { dacOmitDataTrash } from './utils';

interface InfoProofEncryption extends InfoProof {
  dac: DAC;
}

interface InfoVerifyProof extends VerifyProof {
  dac: DAC;
}

const ecdsa = new KJUR.crypto.ECDSA({ curve: 'secp256r1' });
/**

 * Generate merkle tree from certificate data using a pre-defined schema
 * @param {certificates} certData
 * @returns {Promise<MerkleTree>}
 */
async function generateMerkleTree(certData: any) {
  const args = {
    func: 'queryCertificateSchema',
    args: ['v1'],
    isQuery: true,
    identity: certData?.iU,
  };
  const certSchema = await invokeChaincode(args);

  const certDataArray = [];

  //certSchema used to order the certificate elements appropriately.
  //ordering[i] = key of i'th item that should go in the certificate array.
  for (const element of certSchema.ordering) {
    const itemKey = element;
    certDataArray.push(certData[itemKey]);
  }
  const mTreeLeaves = certDataArray.map((x: any) =>
    crypto.SHA256(x).toString(crypto.enc.Hex),
  );

  const mTree = new MerkleTree(mTreeLeaves, crypto.SHA256);
  
  return mTree;
}

/**
 * Generate merkle tree root from certificate data using a pre-defined schema
 * @param {certificates} certData
 * @returns {Promise<string>}
 */
async function generateMerkleRoot(certData: any) {
  const mTree = await generateMerkleTree(certData);
  return mTree.getRoot().toString('hex');
}

/**
 * Sign a String with a private key using Elliptic Curve Digital Signature Algorithm
 * @param stringToSign
 * @param signerEmail
 * @returns {Promise<String>}
 */
async function createDigitalSignature(
  stringToSign: string,
  signerIdentity: string,
): Promise<string> {
  const hexKeyWallet = await loadHexKeysFromWallet(signerIdentity);
  const signedData = ecdsa.signHex(stringToSign, hexKeyWallet.privateKey);
  return signedData;
}

/**
 * Generate a merkleTree Proof object.
 * @param {String[]} paramsToShare - Name of parameters that are to be shared.
 * @param {String} certUUID
 * @param {String} studentEmail - Certiificate holder email. Used to invoke chaincode.
 * @returns {Promise<Buffer[]>} proofObject
 */
async function generateDACProof(
  { sharedFields, idDAC, dac }: InfoProofEncryption,
  identityStudent: string,
) {
  const dacSchema = await queryCertificateSchema(identityStudent);
  const mTree = await generateMerkleTree(dac);
  const paramsToShareIndex = getParamsIndexArray(
    sharedFields,
    dacSchema.ordering,
  );
  
  const layers = mTree.getLayersFlat().map((x: any) => x.toString('hex'));
  const multiProofs = mTree.getMultiProof(layers, paramsToShareIndex);
  return {
    multiProofs,
    rootHash : mTree.getRoot().toString('hex')
  };
}

async function validateRoot(dac: DAC, rootHashBlockchain: string){

  const dacFilter = dacOmitDataTrash(dac);
  
  const mTreeDB = await generateMerkleTree(dacFilter);
  const rootDB = await mTreeDB.getRoot().toString('hex');
  

  
  return rootDB === rootHashBlockchain;
}



async function verifyCertificateProof({
  proof,
  disclosedData,
  mTreeRootBlockchain,
  dac,
}: InfoVerifyProof) {
  const dacSchema = await queryCertificateSchema(fabric.enrollAdminName);
  
  
  const mTree = await generateMerkleTree(dac); //
  const mTreeRoot = mTree.getRoot().toString('hex');

  if(mTreeRoot !== mTreeRootBlockchain) return 3;

  const disclosedDataParamNames = [];
  const disclosedDataValues = [];

  for (const field in disclosedData) {
    disclosedDataParamNames.push(field);
    let dataOfDisclosedData = disclosedData[field];
    if (field === DATE_OF_BIRTH || field === DATE_OF_ISSUING) {
      dataOfDisclosedData = new Date(dataOfDisclosedData);
    }
    disclosedDataValues.push(dataOfDisclosedData);
  }
  const paramsToShareIndex = getParamsIndexArray(
    disclosedDataParamNames,
    dacSchema.ordering,
  );

  const disclosedDataHash: any = disclosedDataValues.map((x) => {
    return crypto.SHA256(x).toString(crypto.enc.Hex);
  });

  const multiProofs = proof.map((item: any) => Buffer.from(item.data));

  const isValid = mTree.verifyMultiProof(
    mTreeRoot,
    paramsToShareIndex,
    disclosedDataHash,
    mTree.getLeafCount(),
    multiProofs,
  );
  return isValid ? 1 : 0;
}



/**
 * Map parameter names to their indexes in certificate ordering schema.
 * @param {String[]} paramsToShare - Name of parameters that are to be shared.
 * @param {String[]} ordering - Order of keys in merkle mTree generation. Look at Schema.ordering in chaincode
 * @returns {int[]} Index oof the params to share based on schema ordering. Eg - [2,3]
 *
 * eg
 * Input, paramsToShare: ["departmentName", "cgpa"].
 * ordering: ["universityName", "major", "departmentName", "cgpa"]
 * Output: [2,3]
 *
 */
function getParamsIndexArray(paramsToShare: string[], ordering: string[]) {
  const paramsToShareIndex = paramsToShare.map((element) => {
    return ordering.findIndex((orderingElement) => {
      return orderingElement === element;
    });
  });

  return paramsToShareIndex.sort((a, b) => a - b);
}



export {
  generateMerkleRoot,
  createDigitalSignature,
  generateDACProof,
  verifyCertificateProof,
  validateRoot
};