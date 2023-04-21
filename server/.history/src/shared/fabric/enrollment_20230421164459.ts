import FabricCAServices from 'fabric-ca-client';
import { Wallets } from 'fabric-network';
import fs from 'fs';
import { fabric } from '../../config';
import logger from '../core/logger';
import { createNewWalletEntity } from './index';
import { BadRequestError } from '../core/apiError';
import { HexKey } from './index';

const ccp = JSON.parse(fs.readFileSync(fabric.ccpPath, 'utf8'));
async function  
async function enrollAdmin(): Promise<HexKey | undefined> {
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
  }
}
async function registerUser(identity: string) {
  try {
    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const wallet = await Wallets.newFileSystemWallet(fabric.walletPath);

    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(identity);
    if (userIdentity) {
      throw Error(
        `An identity for the user ${identity} already exists in the wallet`,
      );
    }

    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get(fabric.enrollAdminName);
    if (!adminIdentity) {
      throw Error(
        `An identity for the admin user ${fabric.enrollAdminName} does not exist in the wallet`,
      );
    }

    // build a user object for authenticating with the CA
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(
      adminIdentity,
      fabric.enrollAdminName,
    );

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      {
        affiliation: 'org1.department1',
        enrollmentID: identity,
        role: 'client',
      },
      adminUser,
    );

    const enrollment = await ca.enroll({
      enrollmentID: identity,
      enrollmentSecret: secret,
    });

    const userKeys = await createNewWalletEntity(enrollment, identity);
    logger.info(
      `Successfully registered and enrolled  user ${identity} and imported it into the wallet`,
    );

    return userKeys;
  } catch (error) {
    logger.error(`Failed to register user ${identity}": ${error}`);
    throw new Error(`Failed to register user ${identity}": ${error}`);
  }
}

async function checkRegisterIdentity(identity: string): Promise<boolean> {
  
}
export { enrollAdmin, registerUser };
