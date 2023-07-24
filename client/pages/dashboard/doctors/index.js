import "date-fns";
import "react-phone-number-input/style.css";
import React, { useEffect, useState } from "react";
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
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { fetchAPIData } from "../../../src/utils/Common";
import EditIcon from "@material-ui/icons/Edit";
import MaterialTable from "material-table";
import LoadingScreen from "../../../src/components/common/LoadingScreen";
import Protected from "../../../src/components/authentication/Protected";
import PhoneNumberInput from "../../../src/components/common/PhoneNumberInput";
import PhoneInput from "react-phone-number-input";

const Doctors = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [doctorName, setDoctorName] = useState("");
  const [doctorGender, setDoctorGender] = useState("M");
  const [doctorFee, setDoctorFee] = useState(0);
  const [doctorID, setDoctorID] = useState("");
  const [doctorStatus, setDoctorStatus] = useState("Y");
  const [modalLoading, setModalLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [editDoctor, setEditDoctor] = useState(false);
  const [doctorSpecialization, setDoctorSpecialization] = useState("");
  const [doctorPhoneNumber, setDoctorPhoneNumber] = useState();
  const [doctorEmergencyContact, setDoctorEmergencyContact] = useState();
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");

  const handleOpen = () => {
    setEditDoctor(false);
    setDoctorName("");
    setDoctorGender("M");
    setDoctorFee(0);
    setDoctorStatus("Y");
    setDoctorSpecialization("");
    setDoctorPhoneNumber();
    setDoctorEmergencyContact();
    setDoctorEmail("");
    setDoctorAddress("");
    setOpen(true);
  };

  const handleEditOpen = (e, rowData) => {
    console.log(rowData);
    setEditDoctor(true);
    setDoctorName(rowData.DOCTOR_NAME.split(".")[1].trim());
    setDoctorGender(rowData.DOCTOR_GENDER);
    setDoctorFee(rowData.DOCTOR_FEE);
    setDoctorStatus(rowData.DOCTOR_STATUS);
    setDoctorSpecialization(rowData.DOCTOR_SPECIALIZATION);
    setDoctorPhoneNumber(rowData.DOCTOR_PHONE);
    setDoctorEmergencyContact(rowData.DOCTOR_EMERGENCY_CONTACT);
    setDoctorEmail(rowData.DOCTOR_EMAIL);
    setDoctorAddress(rowData.DOCTOR_ADDRESS);
    setDoctorID(rowData.ID);
    setOpen(true);
  };

  const handleDoctor = (e) => {
    setModalLoading(true);
    e.preventDefault();
    const formData = {
      doctorName,
      doctorGender,
      doctorFee,
      doctorStatus,
      doctorSpecialization,
      doctorPhoneNumber,
      doctorEmergencyContact,
      doctorEmail,
      doctorAddress,
    };
    if (!editDoctor) {
      fetchAPIData("/adddoctor", formData, "POST").then((json) => {
        console.log(json);
        if (json.status === "Success") {
          handleClose();
          setModalLoading(false);
          setDoctorName("");
          setTableLoading(true);
          getAllDoctors();
        } else {
          // notify(json.message);
          // setShowSnackbar(true);
          // setLoading(false);
        }
      });
    } else {
      formData["doctorID"] = doctorID;
      fetchAPIData("/editdoctor", formData, "POST").then((json) => {
        console.log(json);
        if (json.status === "Success") {
          handleClose();
          setModalLoading(false);
          setDoctorName("");
          setTableLoading(true);
          getAllDoctors();
        } else {
          // notify(json.message);
          // setShowSnackbar(true);
          // setLoading(false);
        }
      });
    }
  };

  const getAllDoctors = () => {
    fetchAPIData("/getalldoctors", "", "GET").then((json) => {
      setDoctors(json.doctors);
      setTableLoading(false);
    });
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <div>
      <PageHeader>
        {!tableLoading ? (
          <MaterialTable
            title="Doctor List"
            data={doctors}
            columns={[
              {
                title: "Doctor Name",
                field: "DOCTOR_NAME",
                width: "100%",
              },
              {
                title: "Doctor Gender",
                field: "DOCTOR_GENDER",
                render: (rowData) => {
                  return rowData.DOCTOR_GENDER == "M" ? (
                    <Chip
                      size="small"
                      label="Male"
                      style={{ backgroundColor: "#6ca0dc", color: "white" }}
                    />
                  ) : (
                    <Chip
                      size="small"
                      label="Female"
                      style={{ backgroundColor: "#AA336A", color: "white" }}
                    />
                  );
                },
              },
              {
                title: "Doctor Fee",
                field: "DOCTOR_FEE",
                render: (rowData) => {
                  return <span>₹ {rowData.DOCTOR_FEE}</span>;
                },
              },
              {
                title: "Doctor Status",
                field: "DOCTOR_STATUS",
                render: (rowData) => {
                  return rowData.DOCTOR_STATUS == "Y" ? (
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
          dialogTitle={`${!editDoctor ? "Add" : "Edit"} a Doctor`}
          loading={modalLoading}
          loadingTitle={`${!editDoctor ? "Adding" : "Editing"} a Doctor...`}
        >
          <form onSubmit={handleDoctor}>
            <TextField
              label="Doctor Name"
              variant="outlined"
              style={{ width: "100%", marginBottom: "15px" }}
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
              autoComplete="off"
              size="small"
            />
            <TextField
              label="Doctor Specialization"
              variant="outlined"
              style={{ width: "100%", marginBottom: "15px" }}
              value={doctorSpecialization}
              onChange={(e) => setDoctorSpecialization(e.target.value)}
              required
              autoComplete="off"
              size="small"
            />
            <PhoneInput
              style={{ width: "100%", marginBottom: "15px" }}
              value={doctorPhoneNumber}
              onChange={(e) => setDoctorPhoneNumber(e)}
              inputComponent={PhoneNumberInput}
              defaultCountry="IN"
              label="Phone Number"
              limitMaxLength={true}
            />
            <PhoneInput
              style={{ width: "100%", marginBottom: "15px" }}
              value={doctorEmergencyContact}
              onChange={(e) => setDoctorEmergencyContact(e)}
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
              value={doctorEmail}
              onChange={(e) => setDoctorEmail(e.target.value)}
              required
              autoComplete="off"
              size="small"
            />
            <TextField
              variant="outlined"
              label="Address"
              multiline
              minRows={3}
              style={{ width: "100%", marginBottom: "15px" }}
              value={doctorAddress}
              onChange={(e) => setDoctorAddress(e.target.value)}
              required
              size="small"
            />
            <FormControl fullWidth variant="outlined" required size="small">
              <InputLabel>Enter Doctor Fee</InputLabel>
              <OutlinedInput
                type="number"
                value={doctorFee}
                onChange={(e) => setDoctorFee(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">₹</InputAdornment>
                }
                labelWidth={120}
              />
            </FormControl>
            <RadioGroup
              row
              value={doctorGender}
              onChange={(e) => setDoctorGender(e.target.value)}
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
              value={doctorStatus}
              onChange={(e) => setDoctorStatus(e.target.value)}
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

export default Protected(Doctors);
