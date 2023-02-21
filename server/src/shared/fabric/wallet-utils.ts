import { Wallets } from 'fabric-network';
import { fabric } from '../../config';
import fs from 'fs';
import path from 'path';
import logger from '../core/logger';

export interface HexKey{
  publicKey: string,
  privateKey: string
  userName: string
}
/**
 * Adds a new user/entity to the wallet. Creates a separate json file to store hex keys of the user.
 * @param {FabricCAServices.IEnrollResponse} enrollmentObject
 * @param {String} userName
 * @returns {Promise<{} | Error>} public and private key in hex format;
 */
async function createNewWalletEntity(enrollmentObject: any, userName: string) {
  const wallet = await Wallets.newFileSystemWallet(fabric.walletPath);

    const x509Identity = {
        credentials: {
            certificate: enrollmentObject.certificate,
            privateKey: enrollmentObject.key.toBytes(),

        },
        mspId: 'Org1MSP',
        type: 'X.509',
    };


    const hexKeyEntity = {
        publicKey: enrollmentObject.key._key.pubKeyHex,
        privateKey: enrollmentObject.key._key.prvKeyHex,
        userName: userName
    };

    const hexDataString = JSON.stringify(hexKeyEntity, null, 4);

    await Promise.all([
        wallet.put(userName, x509Identity),
        fs.writeFile(path.join(fabric.walletPath, `${userName}.json`), hexDataString,
            (err) => { if (err) throw err})
    ]);

    return hexKeyEntity;
}


export {
  createNewWalletEntity
}