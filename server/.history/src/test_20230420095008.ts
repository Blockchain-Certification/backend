import { MerkleTree } from 'merkletreejs';

// create a Merkle tree with some data
const leaves = ['a', 'b', 'c', 'd'].map((x) => Buffer.from(x));
const tree = new MerkleTree(leaves);

// generate a proof for multiple leaf nodes
const proof = tree.getMultiProof([0, 2]); // generates proof for leaves at index 0 and 2

// verify the proof for multiple leaf nodes
const root = tree.getRoot();
const isValid = tree.verifyMultiProof(proof, [0, 2], root); // verifies proof for leaves at index 0 and 2
console.log(isValid); // outputs "true"
