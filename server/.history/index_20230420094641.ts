import { MerkleTree } from 'merkletreejs';
import * as crypto from 'crypto-js';

// Define the data for the Merkle Tree
const data = [
  'data1',
  'data2',
  'data3',
  'data4',
  'data5',
  'data6',
  'data7',
  'data8',
  'data9',
  'data10',
];

// Create a Merkle Tree instance
const tree = new MerkleTree(data, crypto.SHA256);

// Get the index of each leaf node in the Merkle Tree
const paramsToShare = [
  'data1',
  'data5',
  'data9',
];
const paramsToShareIndex = paramsToShare.map(p => data.indexOf(p));

// Get the multi-proof for all leaf nodes in the Merkle Tree
const multiProof = tree.getMultiProof(tree.getHexLayersFlat(), paramsToShareIndex);

// Verify the multi-proof
const root = tree.getRoot().toString('hex');
const leafHashes = paramsToShare.map(p => crypto.SHA256(p).toString());
const verified = tree.verifyMultiProof(multiProof, leafHashes, root);
console.log('Verified: ', verified);