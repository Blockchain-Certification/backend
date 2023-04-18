import { fieldDefault } from '/common/constant';
import { DAC } from '../../shared/database/model';
/**
 * Merge certificate data from Database and Blockchain Ledger
 * Runtime is O(N^2) which is kind of inefficient.
 * Time complexity shouldn't matter too much because N isn't going to grow very large
 * @param {certificates[]} dbRecordArray
 * @param ledgerRecordArray
 * @returns {certificates[]}
 */
export const mergeCertificateData = async (
  dbRecordArray: DAC[],
  ledgerRecordArray: any,
) => {
  const certMergedDataArray = []; //merge data from db and chaincode to create data for ejs view.

  for (let i = 0; i < dbRecordArray.length; i++) {
    const dbEntry = dbRecordArray[i];
    const chaincodeEntry = await ledgerRecordArray.find((element: any) => {
      return element.certUUID === dbEntry._id.toString();
    });
    certMergedDataArray.push({
      dac : {
        ...dbEntry
      },
      hash: chaincodeEntry.certHash,
    });
  }
  return certMergedDataArray;
};


export const paramsToShareAddFieldNeedShareDefault = (
  paramsToShare: string[],
): string[] => {
  return paramsToShare.concat(fieldDefault);
};
