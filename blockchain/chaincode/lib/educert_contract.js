"use strict";

// Fabric smart contract class
const { Contract } = require("fabric-contract-api");
const UniversityProfile = require("./university_profile");
const Schema = require("./schema");

class EducertContract extends Contract {
  /**
   * Initialize the ledger.
   * Certificate schema is written to database during initialization. Schema is necessary for encryption.
   * @param {Context} ctx the transaction context.
   */
  async initLedger(ctx) {
    console.log(
      "-------------------------initLedger Called---------------------------------------"
    );

    let schemaCertificate = new Schema("university degree", "v1", [
      "universityName",
      "major",
      "departmentName",
      "cgpa",
    ]);

    await ctx.stub.putState(
      "schema_" + schemaCertificate.id,
      Buffer.from(JSON.stringify(schemaCertificate))
    );

    return schemaCertificate;
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
    await ctx.stub.putState(
      "UNI" + name,
      Buffer.from(JSON.stringify(university))
    );

    console.log("============= END : Register University ===========");
    return university;
  }
}

module.exports = EducertContract;
