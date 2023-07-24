//? MYSQL TABLE LIST ?//
const AUTH_TABLE_PRE = process.env.AUTH_TABLE_PRE;
const MASTER_TB = `${AUTH_TABLE_PRE}master`;
const COMMON_USER_TB = `${AUTH_TABLE_PRE}users`;
const PATIENTS_TB = `${AUTH_TABLE_PRE}patients`;
const DOCTORS_TB = `${AUTH_TABLE_PRE}doctors`;
const APPOINTMENTS_TB = `${AUTH_TABLE_PRE}appointments`;
const APPOINTMENTS_STATUS_TB = `${AUTH_TABLE_PRE}appointments_status`;

//? MYSQL TABLE LIST ?//

module.exports = {
  MASTER_TB,
  COMMON_USER_TB,
  PATIENTS_TB,
  DOCTORS_TB,
  APPOINTMENTS_TB,
  APPOINTMENTS_STATUS_TB,
};
