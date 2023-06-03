
checkk list user 
check list dac
check verify 


```
// const ordering =  [
//   'id',
//   'idNumber',
//   'registrationNum',
//   'iU',
//   'iSt',
//   'studentName',
//   'universityName',
//   'departmentName',
//   'dateOfBirth',
//   'year',
//   'nameCourse',
//   'major',
//   'nameTypeCertificate',
//   'typeCertificate',
//   'levelCertificate',
//   'placeOfBirth',
//   'nation',
//   'ranking',
//   'formOfTraining',
//   'CGPA',
//   'gender',
// ];
```

=====
Sure, here's an example of how to use the getHexLayersFlat() method to obtain the flattened layers of a simple Merkle tree in hexadecimal format:

Suppose we have a Merkle tree with 4 leaf nodes, where each leaf node represents a hash of a data element. The leaf nodes are as follows:
```
Leaf 0: hash(data0) = 8e2d3c86...
Leaf 1: hash(data1) = 36e316d6...
Leaf 2: hash(data2) = b6a83dc6...
Leaf 3: hash(data3) = 456e0af8...
```
To obtain the flattened layers of the Merkle tree in hexadecimal format, we can follow these steps:

Calculate the hashes of the leaf nodes:
```
hash(Leaf 0) = 8e2d3c86...
hash(Leaf 1) = 36e316d6...
hash(Leaf 2) = b6a83dc6...
hash(Leaf 3) = 456e0af8...
```
Compute the hashes of the non-leaf nodes:
```
hash(0,1) = hash(hash(Leaf 0) + hash(Leaf 1)) = 6c4a6fb4...
hash(2,3) = hash(hash(Leaf 2) + hash(Leaf 3)) = 2c43186c...
hash(0-3) = hash(hash(0,1) + hash(2,3)) = 8287646f...
```
Here, + represents concatenation of the hash values.

Concatenate the hashes at each level in top-to-bottom order, starting with the root node:
```
Root:   8287646f...
Level 1: 6c4a6fb4...2c43186c...
Level 0: 8e2d3c86...36e316d6...b6a83dc6...456e0af8...
```

Convert each concatenated hash value to hexadecimal format:

```
Root:   8287646f...
Level 1: 6c4a6fb4...2c43186c...
Level 0: 8e2d3c86...36e316d6...b6a83dc6...456e0af8...
```

To obtain the flattened layers of this Merkle tree in hexadecimal format using the getHexLayersFlat() method, we can do the following:

```
const leafNodes = [
  '8e2d3c86...',
  '36e316d6...',
  'b6a83dc6...',
  '456e0af8...'
];
const mTree = new MerkleTree(leafNodes);

const flattenedLayersHex = mTree.getHexLayersFlat();
console.log(flattenedLayersHex);
```



This will output the flattened layers of the Merkle tree in hexadecimal format:
```
[  '8287646f...',  '6c4a6fb4...2c43186c...',  '8e2d3c86...36e316d6...b6a83dc6...456e0af8...']
```
