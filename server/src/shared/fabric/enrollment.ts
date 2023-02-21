import FabricCAServices from 'fabric-ca-client';
import { Wallets } from 'fabric-network';
import fs from 'fs';
import { fabric } from '../../config';
import logger from '../core/logger';
import { createNewWalletEntity } from './index';
const ccp = JSON.parse(fs.readFileSync(fabric.ccPath, 'utf8'));

async function enrollAdmin() {
  try {
    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName,
    );

    // Create a new file system based wallet for managing identities.
    const wallet = await Wallets.newFileSystemWallet(fabric.walletPath);

    const identity = await wallet.get(fabric.enrollAdminName);
    if (identity) {
      logger.info(
        'An identity for the admin user "admin" already exists in the wallet.',
      );
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: fabric.enrollAdminName,
      enrollmentSecret: fabric.enrollAdminPassword,
    });
    const adminKeys = await createNewWalletEntity(enrollment, 'admin');
    logger.info(
      'Successfully enrolled admin user "admin" and imported it into the wallet.',
    );
    return adminKeys;
  } catch (err) {
    logger.error(`Failed to enroll admin user "admin": ${err}`);
    process.exit(1);
  }
}

export { enrollAdmin };
