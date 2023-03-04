import { MerkleTree } from 'merkletreejs';
import { SHA256 } from 'crypto-js';
import { invokeChaincode } from './chaincode';
import { DAC } from '../database/model';
import { loadHexKeysFromWallet } from './wallet-utils';

import { KJUR } from 'jsrsasign';

const ecdsa = new KJUR.crypto.ECDSA({'curve': 'secp256r1'});


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

  console.log('======certSchema====', certSchema);

  const certDataArray = [];

  //certSchema used to order the certificate elements appropriately.
  //ordering[i] = key of i'th item that should go in the certificate array.
  for (let i = 0; i < certSchema.ordering.length; i++) {
    const itemKey = certSchema.ordering[i];
    certDataArray.push(certData[itemKey]);
  }

  console.log('=====certDataArray====', certDataArray);
  const mTreeLeaves = certDataArray.map((x) => SHA256(x));
  console.log('======mTreeLeaves====', mTreeLeaves);
  const mTree: MerkleTree = new MerkleTree(mTreeLeaves, SHA256);
  console.log('======mTree====', mTree);
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
) {
  const hexKeyWallet = await loadHexKeysFromWallet(signerIdentity);
  const signedData = ecdsa.signHex(stringToSign, hexKeyWallet.privateKey);
  return signedData;
}

export { generateMerkleRoot, createDigitalSignature };
