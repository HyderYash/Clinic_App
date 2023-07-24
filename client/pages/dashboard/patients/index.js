import "date-fns";
import "react-phone-number-input/style.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "../../../src/components/common/PageHeader";
import {
  PatchedPagination,
  tableIcons,
} from "../../../src/components/common/ReuseableTable";
import ReuseableModal from "../../../src/components/common/ReuseableModal";
import AddBox from "@material-ui/icons/AddBox";
import Button from "@material-ui/core/Button";
import {
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { fetchAPIData, getAge } from "../../../src/utils/Common";
import EditIcon from "@material-ui/icons/Edit";
import MaterialTable from "material-table";
import LoadingScreen from "../../../src/components/common/LoadingScreen";
import Protected from "../../../src/components/authentication/Protected";
import PhoneInput from "react-phone-number-input";
import PhoneNumberInput from "../../../src/components/common/PhoneNumberInput";

const Patients = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [patientName, setPatientName] = useState("");
  const [patientDOB, setPatientDOB] = useState(new Date());
  const [patientGender, setPatientGender] = useState("M");
  const [modalLoading, setModalLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [patientID, setPatientID] = useState("");
  const [editPatient, setEditPatient] = useState(false);
  const [patientStatus, setPatientStatus] = useState("Y");

  const [patientPhoneNumber, setPatientPhoneNumber] = useState();
  const [patientEmergencyContact, setPatientEmergencyContact] = useState();
  const [patientEmail, setPatientEmail] = useState("");
  const [patientAddress, setPatientAddress] = useState("");

  const handleOpen = () => {
    setEditPatient(false);
    setPatientName("");
    setPatientDOB(new Date());
    setPatientGender("M");
    setPatientStatus("Y");
    setPatientPhoneNumber("");
    setPatientEmergencyContact("");
    setPatientEmail("");
    setPatientAddress("");
    setPatientID("");
    setOpen(true);
  };
  const handleEditOpen = (e, rowData) => {
    console.log(rowData);
    setEditPatient(true);
    setPatientName(rowData.PATIENT_NAME);
    setPatientDOB(new Date(rowData.PATIENT_AGE));
    setPatientGender(rowData.PATIENT_GENDER);
    setPatientStatus(rowData.PATIENT_STATUS);
    setPatientPhoneNumber(rowData.PATIENT_PHONE);
    setPatientEmergencyContact(rowData.PATIENT_EMERGENCY_CONTACT);
    setPatientEmail(rowData.PATIENT_EMAIL);
    setPatientAddress(rowData.PATIENT_ADDRESS);
    setPatientID(rowData.ID);
    setOpen(true);
  };

  const handlePatient = (e) => {
    setModalLoading(true);
    e.preventDefault();
    const formData = {
      patientName,
      patientDOB,
      patientGender,
      patientStatus,
      patientPhoneNumber,
      patientEmergencyContact,
      patientEmail,
      patientAddress,
    };
    console.log(formData);
    if (!editPatient) {
      fetchAPIData("/addpatient", formData, "POST").then((json) => {
        console.log(json);
        if (json.status === "Success") {
          handleClose();
          setModalLoading(false);
          setPatientName("");
          setPatientDOB(new Date());
          setTableLoading(true);
          getAllPatients();
        } else {
          // notify(json.message);
          // setShowSnackbar(true);
          // setLoading(false);
        }
      });
    } else {
      formData["patientID"] = patientID;
      fetchAPIData("/editpatient", formData, "POST").then((json) => {
        console.log(json);
        if (json.status === "Success") {
          handleClose();
          setModalLoading(false);
          setPatientName("");
          setPatientDOB(new Date());
          setTableLoading(true);
          getAllPatients();
        } else {
          // notify(json.message);
          // setShowSnackbar(true);
          // setLoading(false);
        }
      });
    }
  };

  const getAllPatients = () => {
    fetchAPIData("/getallpatients", "", "GET").then((json) => {
      setPatients(json.patients);
      setTableLoading(false);
    });
  };

  useEffect(() => {
    getAllPatients();
  }, []);

  return (
    <div>
      <PageHeader>
        {!tableLoading ? (
          <MaterialTable
            title="Patient List"
            data={patients}
            columns={[
              {
                title: "Patient Name",
                field: "PATIENT_NAME",
                render: (rowData) => (
                  <span>
                    <Link href={`/dashboard/patients/${rowData.ID}`}>
                      {rowData.PATIENT_NAME}
                    </Link>
                  </span>
                ),
              },
              {
                title: "Patient Age",
                field: "PATIENT_AGE",
                render: (rowData) => <span>{getAge(rowData.PATIENT_AGE)}</span>,
              },
              {
                title: "Patient Gender",
                field: "PATIENT_GENDER",
                render: (rowData) => {
                  return rowData.PATIENT_GENDER == "M" ? (
                    <Chip
                      size="small"
                      label={rowData.PATIENT_GENDER}
                      style={{ backgroundColor: "#6ca0dc", color: "white" }}
                    />
                  ) : (
                    <Chip
                      size="small"
                      label={rowData.PATIENT_GENDER}
                      style={{ backgroundColor: "#AA336A", color: "white" }}
                    />
                  );
                },
              },
              {
                title: "Patient Status",
                field: "PATIENT_STATUS",
                render: (rowData) => {
                  return rowData.PATIENT_STATUS == "Y" ? (
                    <Chip
                      size="small"
                      label="Active"
                      style={{ backgroundColor: "green", color: "white" }}
                    />
                  ) : (
                    <Chip
                      size="small"
                      label="Inactive"
                      style={{ backgroundColor: "red", color: "white" }}
                    />
                  );
                },
              },
            ]}
            actions={[
              {
                icon: () => <AddBox />,
                tooltip: "Add Patient",
                isFreeAction: true,
                onClick: (event) => handleOpen(),
              },
              {
                icon: () => <EditIcon />,
                tooltip: "Edit Patient",
                onClick: (event, rowData) => handleEditOpen(event, rowData),
              },
            ]}
            icons={tableIcons}
            components={{ Pagination: PatchedPagination }}
            options={{
              actionsColumnIndex: -1,
              paging: true,
              pageSize: 10, // make initial page size
              emptyRowsWhenPaging: false, // To avoid of having empty rows
              pageSizeOptions: [10, 30, 50, 100], // rows selection options
            }}
          />
        ) : (
          <LoadingScreen />
        )}

        <ReuseableModal
          open={open}
          handleClose={handleClose}
          dialogTitle={`${!editPatient ? "Add" : "Edit"} a Patient`}
          dialogContent={() => <AddPatientContent />}
          loading={modalLoading}
          loadingTitle={`${!editPatient ? "Adding" : "Editing"} a Patient...`}
        >
          <form onSubmit={handlePatient}>
            <TextField
              label="Name"
              variant="outlined"
              style={{ width: "100%", marginBottom: "15px" }}
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              autoComplete="off"
              size="small"
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                style={{ width: "100%", marginBottom: "10px" }}
                inputVariant="outlined"
                format="dd/MM/yyyy"
                label="Date of Birth"
                value={patientDOB}
                onChange={(date) => setPatientDOB(date)}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </MuiPickersUtilsProvider>
            <PhoneInput
              style={{ width: "100%", marginBottom: "15px" }}
              value={patientPhoneNumber}
              onChange={(e) => setPatientPhoneNumber(e)}
              inputComponent={PhoneNumberInput}
              defaultCountry="IN"
              label="Phone Number"
              limitMaxLength={true}
            />
            <PhoneInput
              style={{ width: "100%", marginBottom: "15px" }}
              value={patientEmergencyContact}
              onChange={(e) => setPatientEmergencyContact(e)}
              inputComponent={PhoneNumberInput}
              defaultCountry="IN"
              label="Emergency Contact"
              limitMaxLength={true}
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              style={{ width: "100%", marginBottom: "15px" }}
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              required
              autoComplete="off"
              size="small"
            />
            <TextField
              variant="outlined"
              label="Address"
              multiline
              minRows={3}
              style={{ width: "100%", marginBottom: "5px" }}
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              required
              size="small"
            />
            <RadioGroup
              row
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
            >
              <FormControlLabel
                color="blue"
                value="M"
                control={<Radio />}
                label="Male"
              />
              <FormControlLabel
                color="red"
                value="F"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
            <RadioGroup
              row
              value={patientStatus}
              onChange={(e) => setPatientStatus(e.target.value)}
            >
              <FormControlLabel
                color="blue"
                value="Y"
                control={<Radio />}
                label="Active"
              />
              <FormControlLabel
                color="red"
                value="N"
                control={<Radio />}
                label="Inactive"
              />
            </RadioGroup>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </form>
        </ReuseableModal>
      </PageHeader>
    </div>
  );
};

export default Protected(Patients);
