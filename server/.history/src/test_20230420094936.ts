import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'ethereumjs-util';

// Create a list of leaf nodes
const leaves = ['hello', 'world', 'foo', 'bar'].map((x) =>
  keccak256(x)
);

// Create a Merkle tree from the leaf nodes
const tree = new MerkleTree(leaves, keccak256);

// Get the Merkle proof for the first and third leaf nodes
const indexes = [0, 2];
const proof = tree.getMultiProof(indexes);

// Verify the Merkle proof for the first and third leaf nodes
const root = tree.getRoot();
const leafValues = indexes.map((i) => leaves[i]);
const verified = tree.verifyMultiProof(
  proof,
  root,
  leafValues,
  keccak256
);

console.log(verified); // true