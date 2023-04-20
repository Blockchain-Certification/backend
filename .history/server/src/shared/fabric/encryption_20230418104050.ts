import { MerkleTree } from 'merkletreejs';
import CryptoJS, { SHA256 } from 'crypto-js';
import { invokeChaincode } from './chaincode';
import { loadHexKeysFromWallet } from './wallet-utils';
import { queryCertificateSchema } from './callFuncChainCode';
import { KJUR } from 'jsrsasign';
import { InfoProof } from '../../services/dac/student/interface';
import { DAC } from '../database/model';
import { VerifyProof } from '../../services/dac/general/interface';
import { fabric } from '../../config';
interface InfoProofEncryption extends InfoProof {
  dac: DAC;
}

interface InfoVerifyProof extends VerifyProof {
  dac: DAC;
}
const ecdsa = new KJUR.crypto.ECDSA({ curve: 'secp256r1' });
let proofTest: any;
/**

 * Generate merkle tree from certificate data using a pre-defined schema
 * @param {certificates} certData
 * @returns {Promise<MerkleTree>}
 */
async function generateMerkleTree(certData: any): Promise<MerkleTree> {
  const args = {
    func: 'queryCertificateSchema',
    args: ['v1'],
    isQuery: true,
    identity: certData?.iU,
  };

  const certSchema = await invokeChaincode(args);

  let certDataArray = [];

  //certSchema used to order the certificate elements appropriately.
  //ordering[i] = key of i'th item that should go in the certificate array.
  for (const element of certSchema.ordering) {
    const itemKey = element;
    certDataArray.push(certData[itemKey]);
  }

  const mTreeLeaves = certDataArray.map(x => SHA256(x));
  const mTree = new MerkleTree(mTreeLeaves, SHA256);
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

  console.log(m)
  const paramsToShareIndex = getParamsIndexArray(
    sharedFields,
    dacSchema.ordering,
  );


  const multiProof = mTree.getMultiProof(
    mTree.getHexLayersFlat(),
    paramsToShareIndex,
  );
  proofTest = multiProof;
  return multiProof;
}

async function verifyCertificateProof({
  proof,
  disclosedData,
  dacID,
  dac,
}: InfoVerifyProof) {
  const dacSchema = await queryCertificateSchema(fabric.enrollAdminName);
  const mTree: MerkleTree = await generateMerkleTree(dac);

  const disclosedDataParamNames = [];
  const disclosedDataValues = [];

  for (const field in disclosedData) {
    disclosedDataParamNames.push(field);
    disclosedDataValues.push(disclosedData[field]);
  }

  const paramsToShareIndex = getParamsIndexArray(
    disclosedDataParamNames,
    dacSchema.ordering,
  );

  const mTreeRoot = mTree.getRoot();
  const disclosedDataHash: any = disclosedDataValues.map((x) => SHA256(x));

  const proofElements = proof.map((el: any) =>
    Buffer.from(el.data).toString('hex'),
  );

  

  const leavesCount = mTree.getDepth();
  
  const multiProofVerified = mTree.verifyMultiProof(
    mTreeRoot,
    paramsToShareIndex,
    disclosedDataHash,
    leavesCount,
    proofElements,
  );
  console.log(paramsToShareIndex.sort());
  const verificationSuccess = mTree.verifyMultiProof(mTreeRoot, paramsToShareIndex, disclosedDataHash, mTree.getDepth(), proofTest);
  console.log(verificationSuccess);
  console.log(multiProofVerified);
  return multiProofVerified;
}


/**
 * Map parameter names to their indexes in certificate ordering schema.
 * @param {String[]} paramsToShare - Name of parameters that are to be shared.
 * @param {String[]} ordering - Order of keys in merkle tree generation. Look at Schema.ordering in chaincode
 * @returns {int[]} Index oof the params to share based on schema ordering. Eg - [2,3]
 *
 * eg
 * Input, paramsToShare: ["departmentName", "cgpa"].
 * ordering: ["universityName", "major", "departmentName", "cgpa"]
 * Output: [2,3]
 *
 */
function getParamsIndexArray(paramsToShare: string[], ordering: string[]) {
  const paramsToShareIndex = paramsToShare.map( (element) => {
    return ordering.findIndex(
        (orderingElement) => {return orderingElement === element;}) });

return paramsToShareIndex;
}

export {
  generateMerkleRoot,
  createDigitalSignature,
  generateDACProof,
  verifyCertificateProof,
};
