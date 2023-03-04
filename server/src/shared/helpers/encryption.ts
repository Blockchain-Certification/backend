import { MerkleTree } from 'merkletreejs';
// import jsrs from 'jsrsasign';
import { SHA256 } from 'crypto-js';
import { invokeChaincode } from '../fabric/chaincode';
import { DAC } from '../database/model';

// const ecKeypair = jsrsasign.KEYUTIL.generateKeypair('EC', 'secp256r1');
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
  const mTree = new MerkleTree(mTreeLeaves, SHA256);
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

export { generateMerkleRoot };
