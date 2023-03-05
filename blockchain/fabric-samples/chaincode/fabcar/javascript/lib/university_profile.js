"use strict";

class UniversityProfile {
  /**
   * Public profile of a university
   * @param {String} name
   * @param {String} publicKey
   * @param {String} address
   */
  constructor(name, publicKey, address) {
    this.name = name;
    this.publicKey = publicKey;
    this.address = address;
    this.dataType = "university";
  }

  /**
   * Instantiate object from json argument.
   * @param {json} data json data of a Profile instance
   * @returns {UniversityProfile} instantiated University Profile object.
   */

  static deserialize(data) {
    return new UniversityProfile(data.name, data.publicKey, data.address);
  }
}

module.exports = UniversityProfile;
