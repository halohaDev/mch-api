class ShowedUser {
  constructor(payload) {
    this.id = payload.id;
    this.name = payload.name;
    this.nik = payload.nik;
    this.role = payload.role;
    this.address = payload.address;
    this.phoneNumber = payload.phoneNumber;
    this.birthdate = payload.birthdate;
    this.birhplace = payload.birthplace;
    this.religion = payload.religion;
    this.isActiveBpjs = payload.isActiveBpjs;
    this.bpjsKesehatanNumber = payload.bpjsKesehatanNumber;
  }
}

module.exports = ShowedUser;
