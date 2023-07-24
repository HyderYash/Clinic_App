//? Packages/Functions Imports START ?//
const router = require("express").Router();
const DB = require("../utils/databaseFunctions");
const db = new DB();
const HelperFun = require("../helpers/helperFun");
const hf = new HelperFun();
const config = require("../config/config");
const { protect } = require("../middlewares/auth");
//? Packages/Functions Imports END ?//

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hf.encryptPassword(password);
    let sql = `SELECT * from ${config.COMMON_USER_TB} WHERE USER_NAME = '${username}' AND USER_PWD = '${hashedPassword}'`;
    const result = await db.get_sql_exec(sql);
    if (result.length > 0) {
      const myRes = JSON.parse(JSON.stringify(result));
      if (myRes[0].USER_STATUS === "Y") {
        delete myRes[0].USER_PWD;
        let sql = `SELECT * FROM ${config.MASTER_TB} WHERE ID = ${myRes[0].CLINIC_ID}`;
        const clinic = await db.get_sql_exec(sql);
        const myClinic = JSON.parse(JSON.stringify(clinic));
        myRes[0]["clinic"] = myClinic;
        return res.json({
          status: "Success",
          message: "Login Successful!",
          userData: hf.generateJWTForUser(myRes[0]),
        });
      } else {
        return res.json({
          status: "Failed",
          message: "Login Failed! Your account is inactive...",
        });
      }
    } else {
      return res.json({
        status: "Failed",
        message: "Login Failed! Try with another password or username.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.post("/changepassword", async (req, res) => {
  try {
    const { OLD_PASS, NEW_PASS, USER_ID, CLINIC_ID } = req.body;
    const oldHashedPass = await hf.encryptPassword(OLD_PASS);
    const newHashedPass = await hf.encryptPassword(NEW_PASS);
    // Checking if Old Password Exists in DB
    let sql = `SELECT ID from ${
      config.COMMON_USER_TB
    } WHERE USER_PWD = '${oldHashedPass}' AND ID = ${USER_ID} ${hf.clinicIDSuffix(
      CLINIC_ID
    )}`;
    const result = await db.get_sql_exec(sql);
    if (result.length > 0) {
      let sql = `UPDATE ${
        config.COMMON_USER_TB
      } SET USER_PWD = '${newHashedPass}' WHERE USER_PWD = '${oldHashedPass}' AND ID = ${USER_ID} ${hf.clinicIDSuffix(
        CLINIC_ID
      )}`;
      await db.get_sql_exec(sql);
      return res.json({
        status: "Success",
        message: "Please login with your new password",
      });
    } else {
      return res.json({
        status: "Failed",
        message: "The password you have entered is not correct ❌",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.post("/addpatient", protect, async (req, res) => {
  try {
    const {
      patientName,
      patientGender,
      patientDOB,
      patientStatus,
      patientPhoneNumber,
      patientEmergencyContact,
      patientEmail,
      patientAddress,
      USER_ID,
      CLINIC_ID,
    } = req.body;
    const sql = `INSERT INTO ${
      config.PATIENTS_TB
    } (PATIENT_NAME, PATIENT_AGE, PATIENT_GENDER, PATIENT_PHONE, PATIENT_EMERGENCY_CONTACT, PATIENT_EMAIL, PATIENT_ADDRESS, PATIENT_CREATED_ON, PATIENT_STATUS, USER_ID, CLINIC_ID)
    VALUES ('${patientName}', '${hf.convertJSDatetimeToMYSQLDatetime(
      patientDOB
    )}', '${patientGender}', '${patientPhoneNumber}', '${patientEmergencyContact}', '${patientEmail}', '${patientAddress}', '${new Date()
      .toJSON()
      .slice(0, 10)}', '${patientStatus}', ${USER_ID}, ${CLINIC_ID})`;
    console.log(sql);
    await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      message: "Patient Added Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.get("/getallpatients", protect, async (req, res) => {
  try {
    const sql = `SELECT * FROM ${config.PATIENTS_TB} ${hf.clinicIDSuffix(
      req.get("X-CLINIC_ID"),
      "",
      true
    )} ORDER BY PATIENT_CREATED_ON DESC`;
    const result = await db.get_sql_exec(sql);
    const patients = JSON.parse(JSON.stringify(result));
    for (let p of patients) {
      p.PATIENT_CREATED_ON = new Date(p.PATIENT_CREATED_ON).toDateString();
    }
    return res.json({
      status: "Success",
      patients,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.get("/getalldoctors", protect, async (req, res) => {
  try {
    const sql = `SELECT * FROM ${config.DOCTORS_TB} ${hf.clinicIDSuffix(
      req.get("X-CLINIC_ID"),
      "",
      true
    )} ORDER BY DOCTOR_CREATED_ON DESC`;
    const result = await db.get_sql_exec(sql);
    const doctors = JSON.parse(JSON.stringify(result));
    for (let p of doctors) {
      p.DOCTOR_CREATED_ON = new Date(p.DOCTOR_CREATED_ON).toDateString();
    }
    return res.json({
      status: "Success",
      doctors,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.post("/adddoctor", protect, async (req, res) => {
  try {
    const {
      doctorName,
      doctorFee,
      doctorGender,
      doctorStatus,
      doctorSpecialization,
      doctorPhoneNumber,
      doctorEmergencyContact,
      doctorEmail,
      doctorAddress,
      USER_ID,
      CLINIC_ID,
    } = req.body;
    const sql = `INSERT INTO ${
      config.DOCTORS_TB
    } (DOCTOR_NAME, DOCTOR_SPECIALIZATION, DOCTOR_GENDER, DOCTOR_PHONE, DOCTOR_EMERGENCY_CONTACT, DOCTOR_EMAIL, DOCTOR_ADDRESS, DOCTOR_FEE, DOCTOR_CREATED_ON, DOCTOR_STATUS, USER_ID, CLINIC_ID)
    VALUES ('Dr. ${doctorName}', '${doctorSpecialization}', '${doctorGender}', '${doctorPhoneNumber}', '${doctorEmergencyContact}', '${doctorEmail}', '${doctorAddress}', ${doctorFee}, '${new Date()
      .toJSON()
      .slice(0, 10)}', '${doctorStatus}', ${USER_ID}, ${CLINIC_ID})`;
    await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      message: "Doctor Added Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.post("/addappointment", protect, async (req, res) => {
  try {
    const {
      selectedDoctor,
      selectedPatient,
      appointmentDateAndTime,
      selectedAppointmentStatus,
      appointmentDescription,
      appointmentFee,
      appointmentFeePaid,
      appointmentPaymentType,
      USER_ID,
      CLINIC_ID,
    } = req.body;
    const sql = `INSERT INTO ${
      config.APPOINTMENTS_TB
    } (APPOINTMENT_DATETIME, APPOINTMENT_DOCTOR, APPOINTMENT_PATIENT, APPOINTMENT_STATUS, APPOINTMENT_DESC, APPOINTMENT_FEE, APPOINTMENT_FEE_PAID, APPOINTMENT_FEE_PAID_TYPE, USER_ID, CLINIC_ID)
    VALUES ('${hf.convertJSDatetimeToMYSQLDatetime(
      appointmentDateAndTime
    )}', ${selectedDoctor}, ${selectedPatient}, ${selectedAppointmentStatus}, '${appointmentDescription}', ${appointmentFee}, '${appointmentFeePaid}', '${appointmentPaymentType}', ${USER_ID}, ${CLINIC_ID})`;
    await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      message: "Appointment Added Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.get("/getallappointments", protect, async (req, res) => {
  try {
    const sql = `SELECT DISTINCT ca.* , cd.DOCTOR_NAME, cd.DOCTOR_FEE, cp.ID as PATIENT_ID, cp.PATIENT_NAME, cp.PATIENT_AGE, cp.PATIENT_GENDER, cas.ID as APPOINTMENT_STATUS_ID, cas.APPOINTMENT_TYPE_NAME
    FROM clinic_appointments AS ca, clinic_doctors AS cd, clinic_patients AS cp, clinic_appointments_status AS cas
    WHERE ca.APPOINTMENT_DOCTOR = cd.ID
    AND ca.APPOINTMENT_PATIENT = cp.ID
    AND ca.APPOINTMENT_STATUS = cas.ID 
    ${hf.clinicIDSuffix(req.get("X-CLINIC_ID"), "cp")}
    ORDER BY ca.APPOINTMENT_DATETIME`;
    const result = await db.get_sql_exec(sql);
    const appointments = JSON.parse(JSON.stringify(result));
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    for (let a of appointments) {
      a.APPOINTMENT_DATETIME = new Date(a.APPOINTMENT_DATETIME).toLocaleString(
        "en-US",
        options
      );
    }
    return res.json({
      status: "Success",
      appointments,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.get("/getallappointmentsstatus", protect, async (req, res) => {
  try {
    const sql = `SELECT * FROM ${config.APPOINTMENTS_STATUS_TB}`;
    const result = await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      appointmentStatus: result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.post("/editappointment", protect, async (req, res) => {
  try {
    const {
      selectedDoctor,
      selectedPatient,
      appointmentDateAndTime,
      appointmentID,
      appointmentStatusID,
    } = req.body;
    console.log(req.body);
    const sql = `UPDATE ${
      config.APPOINTMENTS_TB
    } SET APPOINTMENT_DATETIME = '${hf.convertJSDatetimeToMYSQLDatetime(
      appointmentDateAndTime
    )}', APPOINTMENT_DOCTOR = ${selectedDoctor}, APPOINTMENT_PATIENT = ${selectedPatient}, APPOINTMENT_STATUS = ${appointmentStatusID} WHERE ID = ${appointmentID}`;
    console.log(sql);
    await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      message: "Appointment edited Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.post("/editdoctor", protect, async (req, res) => {
  try {
    const { doctorName, doctorGender, doctorFee, doctorStatus, doctorID } =
      req.body;
    const sql = `UPDATE ${config.DOCTORS_TB} SET DOCTOR_NAME = 'Dr. ${doctorName}', DOCTOR_GENDER = '${doctorGender}', DOCTOR_FEE = ${doctorFee}, 	DOCTOR_STATUS = '${doctorStatus}' WHERE ID = ${doctorID}`;
    console.log(sql);
    await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      message: "Doctor edited Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.post("/editpatient", protect, async (req, res) => {
  try {
    const {
      patientName,
      patientDOB,
      patientGender,
      patientStatus,
      patientPhoneNumber,
      patientEmergencyContact,
      patientEmail,
      patientAddress,
      patientID,
      USER_ID,
      CLINIC_ID,
    } = req.body;
    const sql = `UPDATE ${
      config.PATIENTS_TB
    } SET PATIENT_NAME = '${patientName}', PATIENT_GENDER	 = '${patientGender}', PATIENT_PHONE = '${patientPhoneNumber}', PATIENT_EMERGENCY_CONTACT = '${patientEmergencyContact}', PATIENT_EMAIL = '${patientEmail}', PATIENT_ADDRESS = '${patientAddress}', PATIENT_AGE = '${hf.convertJSDatetimeToMYSQLDatetime(
      patientDOB
    )}', PATIENT_STATUS = '${patientStatus}', USER_ID = ${USER_ID}, CLINIC_ID = ${CLINIC_ID} WHERE ID = ${patientID}`;
    await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      message: "Patient edited Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.get("/getpatientbyId/:id/:clinicID", protect, async (req, res) => {
  try {
    const { id, clinicID } = req.params; //params = {id:"000000"}
    console.log(req.params);
    const sql = `SELECT * FROM ${
      config.PATIENTS_TB
    } WHERE ID = ${id} ${hf.clinicIDSuffix(clinicID, "")}`;
    const result = await db.get_sql_exec(sql);
    const patients = JSON.parse(JSON.stringify(result));
    for (let p of patients) {
      p.PATIENT_CREATED_ON = new Date(p.PATIENT_CREATED_ON).toDateString();
    }
    return res.json({
      status: "Success",
      patients,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.get(
  "/getdoctorofpatientbyID/:id/:clinicID",
  protect,
  async (req, res) => {
    try {
      const { id, clinicID } = req.params; //params = {id:"000000"}
      const sql = `SELECT DISTINCT D.*
    FROM clinic_patients AS P,
    clinic_doctors AS D,
    clinic_appointments AS AP
    WHERE P.ID = AP.APPOINTMENT_PATIENT 
    AND D.ID = AP.APPOINTMENT_DOCTOR 
    AND P.ID = ${id} 
    ${hf.clinicIDSuffix(clinicID, "P")}
    ORDER BY D.DOCTOR_NAME ASC`;
      const result = await db.get_sql_exec(sql);
      const doctors = JSON.parse(JSON.stringify(result));
      return res.json({
        status: "Success",
        doctors,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        error: error,
      });
    }
  }
);

router.get(
  "/getappointmentbypatientID/:id/:clinicID",
  protect,
  async (req, res) => {
    try {
      const { id, clinicID } = req.params; //params = {id:"000000"}
      const sql = `SELECT DISTINCT ca.* , cd.DOCTOR_NAME, cd.DOCTOR_FEE, cas.ID as APPOINTMENT_STATUS_ID, cas.APPOINTMENT_TYPE_NAME
      FROM clinic_appointments AS ca, clinic_doctors AS cd, clinic_patients AS cp, clinic_appointments_status AS cas
      WHERE ca.APPOINTMENT_DOCTOR = cd.ID
      AND ca.APPOINTMENT_PATIENT = cp.ID
      AND ca.APPOINTMENT_STATUS = cas.ID
  AND cp.ID = ${id}
  ${hf.clinicIDSuffix(clinicID, "cp")}
      ORDER BY ca.APPOINTMENT_DATETIME`;
      const result = await db.get_sql_exec(sql);
      const appointments = JSON.parse(JSON.stringify(result));
      const options = {
        weekday: "short",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      for (let a of appointments) {
        a.APPOINTMENT_DATETIME = new Date(
          a.APPOINTMENT_DATETIME
        ).toLocaleString("en-US", options);
      }
      return res.json({
        status: "Success",
        appointments,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        error: error,
      });
    }
  }
);

router.get("/getallclinics", protect, async (req, res) => {
  try {
    const sql = `SELECT * FROM ${config.MASTER_TB} ORDER BY CLINIC_CREATED_ON DESC`;
    const result = await db.get_sql_exec(sql);
    const clinics = JSON.parse(JSON.stringify(result));
    for (let c of clinics) {
      c.CLINIC_CREATED_ON = new Date(c.CLINIC_CREATED_ON).toDateString();
    }
    return res.json({
      status: "Success",
      clinics,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.post("/addclinic", protect, async (req, res) => {
  try {
    const {
      clinicName,
      clinicStatus,
      clinicPhoneNumber,
      clinicEmail,
      clinicAddress,
      clinicTheme,
    } = req.body;
    const sql = `INSERT INTO ${
      config.MASTER_TB
    } (CLINIC_NAME, CLINIC_EMAIL, CLINIC_ADDRESS, CLINIC_PHONE, CLINIC_THEME, CLINIC_STATUS, CLINIC_CREATED_ON)
    VALUES ('${clinicName}', '${clinicEmail}', '${clinicAddress}', '${clinicPhoneNumber}', '${clinicTheme}', '${clinicStatus}', '${new Date()
      .toJSON()
      .slice(0, 10)}')`;
    console.log(sql);
    await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      message: "Clinic Added Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.post("/editclinic", protect, async (req, res) => {
  try {
    const {
      clinicName,
      clinicStatus,
      clinicPhoneNumber,
      clinicEmail,
      clinicAddress,
      clinicTheme,
      clinicID,
    } = req.body;
    const sql = `UPDATE ${config.MASTER_TB} SET CLINIC_NAME = '${clinicName}', CLINIC_EMAIL	 = '${clinicEmail}', CLINIC_ADDRESS = '${clinicAddress}', CLINIC_PHONE = '${clinicPhoneNumber}', CLINIC_THEME = '${clinicTheme}', CLINIC_STATUS = '${clinicStatus}' WHERE ID = ${clinicID}`;
    await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      message: "Clinic edited Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.get("/getallusers", protect, async (req, res) => {
  try {
    const sql = `SELECT u.*, m.CLINIC_NAME FROM ${config.COMMON_USER_TB} as u, ${config.MASTER_TB} as m WHERE USER_TYPE != 'S' AND u.CLINIC_ID = m.ID`;
    const result = await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      users: result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.post("/addclinicuser", protect, async (req, res) => {
  try {
    const {
      userName,
      userStatus,
      userEmail,
      userDisplayName,
      userType,
      clinicUserClinicID,
    } = req.body;
    // Getting clinic Name
    let sql = `SELECT CLINIC_NAME FROM ${config.MASTER_TB} WHERE ID = ${clinicUserClinicID}`;
    const clinic = await db.get_sql_exec(sql);
    const clinicName = JSON.parse(JSON.stringify(clinic))[0].CLINIC_NAME;
    const tempPass = hf.makeTempPassFromUsernameAndClinicName(
      userName,
      clinicName
    );
    // Generate Random Avatar Color
    const avatarColor = hf.generateRandomHex();
    // Hashing tempPass to store into DB
    const hashedTempPass = await hf.encryptPassword(tempPass);
    sql = `INSERT INTO ${
      config.COMMON_USER_TB
    } (USER_NAME, USER_DISPLAY_NAME, USER_PWD, USER_EMAIL, USER_AVATAR_COLOR, USER_LAST_LOGIN, USER_TYPE, USER_STATUS, CLINIC_ID)
    VALUES ('${userName}', '${userDisplayName}', '${hashedTempPass}', '${userEmail}', '${avatarColor}', '${new Date()
      .toJSON()
      .slice(
        0,
        10
      )}', '${userType}', '${userStatus}', '${clinicUserClinicID}')`;
    console.log(sql);
    await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      message: "Clinic User Added Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.post("/editclinicuser", protect, async (req, res) => {
  try {
    const {
      userName,
      userStatus,
      userEmail,
      userDisplayName,
      userType,
      clinicUserClinicID,
      userID,
    } = req.body;
    const sql = `UPDATE ${config.COMMON_USER_TB} SET USER_NAME = '${userName}', USER_DISPLAY_NAME = '${userDisplayName}', USER_EMAIL = '${userEmail}', USER_TYPE = '${userType}', USER_STATUS = '${userStatus}', CLINIC_ID = '${clinicUserClinicID}' WHERE ID = ${userID}`;
    await db.get_sql_exec(sql);
    return res.json({
      status: "Success",
      message: "Clinic User edited Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

// File Export
module.exports = router;
