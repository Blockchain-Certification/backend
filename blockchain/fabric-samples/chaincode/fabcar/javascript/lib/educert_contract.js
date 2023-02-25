'use strict';

// Fabric smart contract class
const { Contract } = require('fabric-contract-api');
const Certificate = require('./certificate');
const UniversityProfile = require('./university_profile');
const Schema = require('./schema');


class EducertContract extends Contract {

    /**
     * Initialize the ledger.
     * Certificate schema is written to database during initialization. Schema is necessary for encryption.
     * @param {Context} ctx the transaction context.
     */
    async initLedger(ctx) {
        console.log("-------------------------initLedger Called---------------------------------------")

        let schemaCertificate = new Schema("university degree", "v1", ["universityName", "major", "departmentName", "cgpa"] );

        await ctx.stub.putState("schema_" + schemaCertificate.id, Buffer.from(JSON.stringify(schemaCertificate)));

        return schemaCertificate;
    }

    /**
     * Issue a new certificate to the ledger.
     * @param {Context} ctx The transaction context
     * @param {String} certHash - Hash created from the certificate data.
     * @param {String} universitySignature - Signature of @certHash signed by private key of issuer(university)
     * @param {String} studentSignature - Signature of @certHash signed by private key of holder(student)
     * @param {String} dateOfIssuing - Date the certificate was issued
     * @param {String} certUUID - UUID for a certificate (automatically generated. Must match with database entry)
     * @param {String} universityPK - Public key or public ID of issuer account
     * @param {String} studentPK - Public key or public ID of student account
     */
    async issueCertificate(ctx, certHash, universitySignature, studentSignature, dateOfIssuing, certUUID, universityPK, studentPK) {
        console.log("============= START : Issue Certificate ===========");
        //todo: Validate data.

        const certificate = new Certificate(certHash, universitySignature, studentSignature, dateOfIssuing, certUUID, universityPK, studentPK);
        await ctx.stub.putState("CERT" + certUUID, Buffer.from(JSON.stringify(certificate)));

        console.log("============= END : Issue Certificate ===========");
        return certificate;
    }


    /**
    * Register a university. Must be done when a university enrolls into the platform.
    * @param {Context} ctx The transaction context
    * @param {String} name
    * @param {String} publicKey
    * @param {String} address
    */
    async registerUniversity(ctx, name, publicKey, address) {
        console.log("============= START : Register University ===========");
        //todo Add validation.
        const university = new UniversityProfile(name, publicKey, address);
        await ctx.stub.putState("UNI" + name, Buffer.from(JSON.stringify(university)));

        console.log("============= END : Register University ===========");
        return university;
    }
}




module.exports = EducertContract;
