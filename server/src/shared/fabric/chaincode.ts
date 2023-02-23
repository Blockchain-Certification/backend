import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import { fabric } from '../../config';
import logger from '../core/logger';

export interface ArgsFunctionCallChainCode {
  func: string;
  args: string[];
  isQuery: boolean;
  identity: string;
}

/**
 * Do all initialization needed to invoke chaincode
 * @param userEmail
 * @returns {Promise<{contract: Contract, gateway: Gateway, network: Network} | Error>} Network objects needed to interact with chaincode
 */
async function connectToNetwork(identityUser: string) {
  const ccp = JSON.parse(fs.readFileSync(fabric.ccpPath, 'utf8'));
  const wallet = await Wallets.newFileSystemWallet(fabric.walletPath);

  const identity = await wallet.get(identityUser);
  if (!identity) {
    logger.error(
      `An identity for the user with ${identityUser} does not exist in the wallet`,
    );
    logger.info('Run the registerUser.js application before retrying');
    throw new Error(
      `An identity for the user with ${identityUser} does not exist in the wallet`,
    );
  }

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: identityUser,
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork(fabric.channelName);
  const contract = network.getContract(fabric.chaincodeName);

  return {
    gateway,
    network,
    contract,
  };
}

/**
 * Invoke any chaincode using fabric sdk
 *
 * @param {String} func - The chaincode function to call
 * @param {[String]} args - Arguments to chaincode function
 * @param {Boolean} isQuery - True if query function, False if transaction function
 * @param {String} identity - Email of fabric user that invokes chaincode. Must be enrolled and have entity in wallet.
 * @returns {Promise<JSON>} Data returned from ledger in Object format
 */

async function invokeChaincode({
  identity,
  func,
  args,
  isQuery,
}: ArgsFunctionCallChainCode) {
  try {
    const networkObj = await connectToNetwork(identity);
    logger.debug('inside invoke');
    logger.debug(`isQuery: ${isQuery}, func: ${func}, args: ${args}`);

    if (isQuery === true) {
      logger.debug('inside isQuery');

      if (args) {
        logger.debug('inside isQuery, args');
        logger.debug(args);
        const response = await networkObj.contract.evaluateTransaction(
          func,
          ...args,
        );
        logger.debug(response);
        logger.debug(
          `Transaction ${func} with args ${args} has been evaluated`,
        );

        await networkObj.gateway.disconnect();
        return JSON.parse(response.toString());
      } else {
        const response = await networkObj.contract.evaluateTransaction(func);
        logger.debug(response);
        logger.debug(`Transaction ${func} without args has been evaluated`);

        await networkObj.gateway.disconnect();

        return JSON.parse(response.toString());
      }
    } else {
      logger.debug('notQuery');
      if (args) {
        logger.debug('notQuery, args');
        logger.debug('$$$$$$$$$$$$$ args: ');
        logger.debug(args);
        logger.debug(func);

        const response = await networkObj.contract.submitTransaction(
          func,
          ...args,
        );
        logger.debug('after submit');

        logger.debug(response);
        logger.debug(
          `Transaction ${func} with args ${args} has been submitted`,
        );

        await networkObj.gateway.disconnect();

        return JSON.parse(response.toString());
      } else {
        const response = await networkObj.contract.submitTransaction(func);
        logger.debug(response);
        logger.debug(`Transaction ${func} with args has been submitted`);

        await networkObj.gateway.disconnect();

        return JSON.parse(response.toString());
      }
    }
  } catch (error) {
    logger.error(`Failed to submit transaction: ${error}`);
    throw error;
  }
}

export { invokeChaincode };
