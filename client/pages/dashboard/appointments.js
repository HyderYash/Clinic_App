import "date-fns";
import React, { useEffect, useState } from "react";
import PageHeader from "../../src/components/common/PageHeader";
import {
  PatchedPagination,
  tableIcons,
} from "../../src/components/common/ReuseableTable";
import ReuseableModal from "../../src/components/common/ReuseableModal";
import AddBox from "@material-ui/icons/AddBox";
import Button from "@material-ui/core/Button";
import {
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import { fetchAPIData, getAge } from "../../src/utils/Common";
import MaterialTable from "material-table";
import EditIcon from "@material-ui/icons/Edit";
import LoadingScreen from "../../src/components/common/LoadingScreen";
import Protected from "../../src/components/authentication/Protected";
import Link from "next/link";

const Appointments = () => {
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState(new Date());
  const [modalLoading, setModalLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedAppointmentStatus, setSelectedAppointmentStatus] =
    useState("");
  const [appointmentID, setAppointmentID] = useState("");
  const [editAppointment, setEditAppointment] = useState(false);
  const [appointmentDescription, setApointmentDescription] = useState("");
  const [appointmentFee, setAppointmentFee] = useState(0);
  const [appointmentFeePaid, setAppointmentFeePaid] = useState(false);
  const [appointmentPaymentType, setAppointmentPaymentType] = useState("Cash");

  const handleAddOpen = () => {
    setSelectedDoctor("");
    setSelectedPatient("");
    setAppointmentDate(new Date());
    setAppointmentTime(new Date());
    setApointmentDescription("");
    setAppointmentFee(0);
    setAppointmentFeePaid(false);
    setAppointmentPaymentType("Cash");
    setEditAppointment(false);
    setOpen(true);
    setModalLoading(true);
    getAllDoctors();
    getAllPatients();
    getAllAppointmentsStatus();
    setModalLoading(false);
  };
  const handleClose = () => setOpen(false);

  const handleEditOpen = (e, rowData) => {
    console.log(rowData);
    setEditAppointment(true);
    setModalLoading(true);
    getAllDoctors();
    getAllPatients();
    getAllAppointmentsStatus();
    setSelectedDoctor(rowData.APPOINTMENT_DOCTOR);
    setSelectedPatient(rowData.APPOINTMENT_PATIENT);
    setSelectedAppointmentStatus(rowData.APPOINTMENT_STATUS_ID);
    setAppointmentDate(new Date(rowData.APPOINTMENT_DATETIME));
    setAppointmentTime(new Date(rowData.APPOINTMENT_DATETIME));
    setApointmentDescription(rowData.APPOINTMENT_DESC);
    setAppointmentFee(rowData.APPOINTMENT_FEE);
    setAppointmentFeePaid(rowData.APPOINTMENT_FEE_PAID === "Y" ? true : false);
    setAppointmentPaymentType(rowData.APPOINTMENT_FEE_PAID_TYPE);
    setAppointmentID(rowData.ID);
    setOpen(true);
    setModalLoading(false);
  };

  const handleAppointment = (e) => {
    e.preventDefault();
    // setModalLoading(true);
    const appointmentDateAndTime =
      appointmentDate.toISOString().slice(0, 10) +
      " " +
      appointmentTime.toLocaleTimeString("it-IT");
    const formData = {
      selectedDoctor,
      selectedPatient,
      selectedAppointmentStatus,
      appointmentDateAndTime,
      appointmentDescription,
      appointmentFee,
      appointmentFeePaid: appointmentFeePaid === true ? "Y" : "N",
      appointmentPaymentType,
    };
    if (!editAppointment) {
      fetchAPIData("/addappointment", formData, "POST").then((json) => {
        console.log(json);
        if (json.status === "Success") {
          handleClose();
          setModalLoading(false);
          setTableLoading(true);
          setSelectedDoctor("");
          setSelectedPatient("");
          getAllAppointments();
          // setDoctorName("");
        } else {
          // notify(json.message);
          // setShowSnackbar(true);
          // setLoading(false);
        }
      });
    } else {
      formData["appointmentID"] = appointmentID;
      formData["appointmentStatusID"] = selectedAppointmentStatus;
      fetchAPIData("/editappointment", formData, "POST").then((json) => {
        console.log(json);
        if (json.status === "Success") {
          handleClose();
          setModalLoading(false);
          setTableLoading(true);
          setSelectedDoctor("");
          setSelectedPatient("");
          getAllAppointments();
          // setDoctorName("");
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
    });
  };

  const getAllPatients = () => {
    fetchAPIData("/getallpatients", "", "GET").then((json) => {
      setPatients(json.patients);
    });
  };

  const getAllAppointments = () => {
    fetchAPIData("/getallappointments", "", "GET").then((json) => {
      setAppointments(json.appointments);
      setTableLoading(false);
    });
  };

  const getAllAppointmentsStatus = () => {
    fetchAPIData("/getallappointmentsstatus", "", "GET").then((json) => {
      setAppointmentStatus(json.appointmentStatus);
    });
  };

  useEffect(() => {
    getAllAppointments();
  }, []);

  const ChipBasedOnAppointmentType = ({ type, title }) => {
    if (type === 1) {
      return (
        <Chip
          size="small"
          label={title}
          style={{ backgroundColor: "green", color: "white" }}
        />
      );
    } else if (type === 2) {
      return (
        <Chip
          size="small"
          label={title}
          style={{ backgroundColor: "blue", color: "white" }}
        />
      );
    } else if (type === 3) {
      return (
        <Chip
          size="small"
          label={title}
          style={{ backgroundColor: "red", color: "white" }}
        />
      );
    } else if (type === 4) {
      return (
        <Chip
          size="small"
          label={title}
          style={{ backgroundColor: "#f0ad4e", color: "white" }}
        />
      );
    }
  };

  return (
    <div>
      <PageHeader>
        {!tableLoading ? (
          <MaterialTable
            icons={tableIcons}
            title="Appointments"
            columns={[
              { title: "Doctor Name", field: "DOCTOR_NAME" },
              {
                title: "Patient Name",
                field: "PATIENT_NAME",
                render: (rowData) => (
                  <span>
                    <Link href={`/dashboard/patients/${rowData.PATIENT_ID}`}>
                      {rowData.PATIENT_NAME}
                    </Link>
                  </span>
                ),
              },
              {
                title: "Date time",
                field: "APPOINTMENT_DATETIME",
                width: "100%",
              },
              { title: "Doctor Fee", field: "DOCTOR_FEE" },
              {
                title: "Patient Age",
                field: "PATIENT_AGE",
                render: (rowData) => <span>{getAge(rowData.PATIENT_AGE)}</span>,
              },
              { title: "Patient Gender", field: "PATIENT_GENDER" },
              {
                title: "Appointment Status",
                field: "APPOINTMENT_TYPE_NAME",
                render: (rowData) => (
                  <ChipBasedOnAppointmentType
                    type={rowData.APPOINTMENT_STATUS_ID}
                    title={rowData.APPOINTMENT_TYPE_NAME}
                  />
                ),
              },
            ]}
            data={appointments}
            actions={[
              {
                icon: () => <AddBox />,
                tooltip: "Add Appointment",
                isFreeAction: true,
                onClick: (event) => handleAddOpen(),
              },
              {
                icon: () => <EditIcon />,
                tooltip: "Add Appointment",
                onClick: (event, rowData) => handleEditOpen(event, rowData),
              },
            ]}
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
          dialogTitle="Add Appointment"
          loading={modalLoading}
          loadingTitle="Adding Appointment..."
        >
          <form onSubmit={handleAppointment}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid
                container
                justifyContent="space-between"
                style={{ marginBottom: "15px" }}
              >
                <KeyboardDatePicker
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  label="Appointment Date"
                  value={appointmentDate}
                  onChange={(date) => setAppointmentDate(date)}
                  InputProps={{ readOnly: true }}
                  required
                  size="small"
                />
                <KeyboardTimePicker
                  inputVariant="outlined"
                  label="Time picker"
                  value={appointmentTime}
                  onChange={(time) => setAppointmentTime(time)}
                  required
                  size="small"
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <FormControl
              variant="outlined"
              style={{ width: "100%", marginBottom: "15px" }}
              size="small"
            >
              <InputLabel>Doctor</InputLabel>
              <Select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                label="Select Doctor"
              >
                {doctors.map((item) => (
                  <MenuItem value={item.ID} key={item.ID}>
                    {item.DOCTOR_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ width: "100%", marginBottom: "15px" }}
              size="small"
            >
              <InputLabel>Patient</InputLabel>
              <Select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                label="Select Patient"
              >
                {patients.map((item) => (
                  <MenuItem value={item.ID} key={item.ID}>
                    {item.PATIENT_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ width: "100%", marginBottom: "15px" }}
              size="small"
            >
              <InputLabel>Appointment Status</InputLabel>
              <Select
                value={selectedAppointmentStatus}
                onChange={(e) => setSelectedAppointmentStatus(e.target.value)}
                label="Select Patient"
              >
                {appointmentStatus.map((item) => (
                  <MenuItem value={item.ID} key={item.ID}>
                    {item.APPOINTMENT_TYPE_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              label="Appointment Description"
              multiline
              minRows={3}
              style={{ width: "100%", marginBottom: "15px" }}
              value={appointmentDescription}
              onChange={(e) => setApointmentDescription(e.target.value)}
              required
              size="small"
            />
            <FormControl
              fullWidth
              variant="outlined"
              required
              size="small"
              style={{ width: "100%" }}
            >
              <InputLabel>Appointment Fee</InputLabel>
              <OutlinedInput
                type="number"
                value={appointmentFee}
                onChange={(e) => setAppointmentFee(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">₹</InputAdornment>
                }
                labelWidth={120}
              />
            </FormControl>
            <div style={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={appointmentFeePaid}
                    onChange={(e) => setAppointmentFeePaid(e.target.checked)}
                    color="primary"
                  />
                }
                label="Appointment Fee Paid"
              />
            </div>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <Chip
                label="Payment Type"
                size="small"
                style={{
                  backgroundColor: "green",
                  color: "white",
                }}
              />
              <RadioGroup
                row
                value={appointmentPaymentType}
                onChange={(e) => setAppointmentPaymentType(e.target.value)}
              >
                <FormControlLabel
                  value="Cash"
                  control={<Radio />}
                  label="Cash"
                />
                <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
                <FormControlLabel
                  value="Credit Card"
                  control={<Radio />}
                  label="Credit Card"
                />
                <FormControlLabel
                  value="Debit Card"
                  control={<Radio />}
                  label="Debit Card"
                />
              </RadioGroup>
            </FormControl>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </form>
        </ReuseableModal>
      </PageHeader>
    </div>
  );
};

export default Protected(Appointments);
