import { MerkleTree } from 'merkletreejs';

// create a Merkle tree with some data
const leaves = ['a', 'b', 'c', 'd'].map((x) => Buffer.from(x));
const tree = new MerkleTree(leaves);

// generate a proof for multiple leaf nodes
const proof = tree.getMultiProof([0, 2]);

// verify the proof for multiple leaf nodes
const root = tree.getRoot();
const proofIndices = [0, 2];
const proofLeaves = ['a', 'c'].map((x) => Buffer.from(x));
const leavesCount = leaves.length;
const isValid = tree.verifyMultiProof(root, proofIndices, proofLeaves, leavesCount, proof);
console.log(isValid); // outputs "true"
