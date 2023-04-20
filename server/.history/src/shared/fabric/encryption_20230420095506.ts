const { MerkleTree } = require('merkletreejs');
import * as crypto from 'crypto-js';
import { invokeChaincode } from './chaincode';
import { loadHexKeysFromWallet } from './wallet-utils';
import { queryCertificateSchema } from './callFuncChainCode';
import { KJUR } from 'jsrsasign';
import { InfoProof } from '../../services/dac/student/interface';
import { DAC } from '../database/model';
import { VerifyProof } from '../../services/dac/general/interface';
import { fabric } from '../../config';
// const certificateDBData = {
//   _id: '643f9ad5fc8faa66beb8365a',
//   studentEmail: 'ngocphupham682001@gmail.com',
//   studentName: 'ngocphu',
//   universityName: 'hiii',
//   universityEmail: 'ngocphupham03@gmail.com',
//   major: 'asd',
//   departmentName: '1',
//   cgpa: '3',
//   dateOfIssuing: '2023-04-11T00:00:00.000Z',
//   __v: 0,
// };

// const paramsToShareIndex = [1, 2];

// const disclosedDataHash: any = [
//   {
//     words: [
//       1753712600, -15446960, 746544383, -1426182971, -1999085447, -102856656,
//       1277604043, -1714515514,
//     ],
//     sigBytes: 32,
//   },
//   {
//     words: [
//       1803989619, -13304607, -1653899186, -10862761, 1202562282, -1573970615,
//       -1071754531, -1215866037,
//     ],
//     sigBytes: 32,
//   },
// ];

// const mTreeProof: any = [
//   '0x4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
//   '0xcfeadd1353bcc2d50a484de47f12069ea0fce82ae748ff27b54559ddd028f443',
// ];

// const certSchema = {
//   ordering: [
//     'studentName',
//     'studentEmail',
//     'universityName',
//     'universityEmail',
//     'major',
//     'departmentName',
//     'cgpa',
//   ],
// };
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

  let certDataArray = [];

  //certSchema used to order the certificate elements appropriately.
  //ordering[i] = key of i'th item that should go in the certificate array.
  for (const element of certSchema.ordering) {
    const itemKey = element;
    certDataArray.push(certData[itemKey]);
  }
  const mTreeLeaves = certDataArray.map((x) => crypto.SHA256(x));
  const mTree = new MerkleTree(mTreeLeaves, crypto.SHA256);

  const Mproof = tree.getMultiProof([0, 2]);
  console.log(Mproof);
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
  const multiProof = mTree.getMultiProof(
    paramsToShareIndex,
  );
  return multiProof;
}

async function verifyCertificateProof({
  proof,
  disclosedData,
  dacID,
  dac,
}: InfoVerifyProof) {
  // const dacSchema = await queryCertificateSchema(fabric.enrollAdminName);
  // const mTree = await generateMerkleTree(dac);
  // const disclosedDataParamNames = [];
  // const disclosedDataValues = [];

  // for (const field in disclosedData) {
  //   disclosedDataParamNames.push(field);
  //   disclosedDataValues.push(disclosedData[field]);
  // }
  // const paramsToShareIndex = getParamsIndexArray(
  //   disclosedDataParamNames,
  //   dacSchema.ordering,
  // );

  // const mTreeRoot = mTree.getRoot().toString('hex');
  // const disclosedDataHash: any = disclosedDataValues.map((x) =>
  //   crypto.SHA256(x).toString(),
  // );

  // try {
  //   let verificationSuccess = mTree.verifyMultiProof(
  //    proof,
  //    disclosedDataHash,
  //    mTreeRoot
  //   );

  //   console.log(verificationSuccess);
  // } catch (err) {
  //   console.log(err);
  // }
  const leaves = ['a', 'b', 'c', 'd'].map((x) => Buffer.from(x));
  const tree = new MerkleTree(leaves);

  // generate a proof for multiple leaf nodes
  const Mproof = tree.getMultiProof([0, 2]);
  console.log(Mproof);
  // verify the proof for multiple leaf nodes
  const root = tree.getRoot();
  const proofIndices = [0, 2];
  const proofLeaves = ['a', 'c'].map((x) => Buffer.from(x));
  const leavesCount = leaves.length;
  const isValid = tree.verifyMultiProof(
    root,
    proofIndices,
    proofLeaves,
    leavesCount,
    Mproof,
  );
  console.log(isValid); // outputs "true"
  return false;
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
  const paramsToShareIndex = paramsToShare.map((element) => {
    return ordering.findIndex((orderingElement) => {
      return orderingElement === element;
    });
  });

  return paramsToShareIndex;
}

export {
  generateMerkleRoot,
  createDigitalSignature,
  generateDACProof,
  verifyCertificateProof,
};
