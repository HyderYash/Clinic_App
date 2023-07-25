import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import PageHeader from "../../../src/components/common/PageHeader";
import { fetchAPIData, getAge } from "../../../src/utils/Common";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import LoadingScreen from "../../../src/components/common/LoadingScreen";
import MaterialTable from "material-table";
import {
  PatchedPagination,
  tableIcons,
} from "../../../src/components/common/ReuseableTable";
import { Breadcrumbs, Chip, Link } from "@material-ui/core";
import jwt_decode from "jwt-decode";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

export default function PatientID() {
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [patientDetails, setPatientDetails] = useState([]);
  const [doctorsDetails, setDoctorsDetails] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const getPatientByID = (clinicID) => {
    fetchAPIData(`/getpatientbyId/${id}/${clinicID}`, "", "GET").then(
      (json) => {
        setPatientDetails(json.patients[0]);
      }
    );
  };

  const getDoctorOfPatientByID = (clinicID) => {
    fetchAPIData(`/getdoctorofpatientbyID/${id}/${clinicID}`, "", "GET").then(
      (json) => {
        console.log(json.doctors);
        setDoctorsDetails(json.doctors);
      }
    );
  };

  const getAppointmentByPatientID = (clinicID) => {
    fetchAPIData(
      `/getappointmentbypatientID/${id}/${clinicID}`,
      "",
      "GET"
    ).then((json) => {
      console.log(json);
      setAppointments(json.appointments);
    });
  };

  useEffect(() => {
    if (!router.isReady) return;
    const clinicID = jwt_decode(sessionStorage.getItem("token")).clinic[0].ID;
    console.log(jwt_decode(sessionStorage.getItem("token")).clinic);
    getPatientByID(clinicID);
    getDoctorOfPatientByID(clinicID);
    getAppointmentByPatientID(clinicID);
    setLoading(false);
  }, [
    router.isReady,
    getAppointmentByPatientID,
    getDoctorOfPatientByID,
    getPatientByID,
  ]);

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
    <div className={classes.root}>
      <PageHeader>
        {!loading ? (
          <>
            <Breadcrumbs style={{ margin: "2px 0px 7px 0px" }}>
              <Chip
                variant="outlined"
                size="small"
                label="Go Back"
                clickable
                color="primary"
                icon={<ArrowBackIcon />}
                onClick={() => router.back()}
              />
            </Breadcrumbs>
            <Grid container spacing={1} style={{ marginBottom: "10px" }}>
              <Grid item xs={3}>
                <Card style={{ height: 220 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Patient Details
                    </Typography>
                    <Typography variant="body2" component="p">
                      Name: {patientDetails.PATIENT_NAME}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Age: {getAge(patientDetails.PATIENT_AGE)}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Email: {patientDetails.PATIENT_EMAIL}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Phone: {patientDetails.PATIENT_PHONE}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Emergency Contact:{" "}
                      {patientDetails.PATIENT_EMERGENCY_CONTACT}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Address: {patientDetails.PATIENT_ADDRESS}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {doctorsDetails.map((item) => (
                <Grid item xs={3} key={item.ID}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Doctor Details
                      </Typography>
                      <Typography variant="body2" component="p">
                        Name: {item.DOCTOR_NAME}
                      </Typography>
                      <Typography variant="body2" component="p">
                        Specialization: {item.DOCTOR_SPECIALIZATION}
                      </Typography>
                      <Typography variant="body2" component="p">
                        Gender: {item.DOCTOR_GENDER === "M" ? "Male" : "Female"}
                      </Typography>
                      <Typography variant="body2" component="p">
                        Email: {item.DOCTOR_EMAIL}
                      </Typography>
                      <Typography variant="body2" component="p">
                        Phone: {item.DOCTOR_PHONE}
                      </Typography>
                      <Typography variant="body2" component="p">
                        Emergency Contact: {item.DOCTOR_EMERGENCY_CONTACT}
                      </Typography>
                      <Typography variant="body2" component="p">
                        Address: {item.DOCTOR_ADDRESS}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <MaterialTable
              icons={tableIcons}
              title="Appointments"
              columns={[
                {
                  title: "Date time",
                  field: "APPOINTMENT_DATETIME",
                  width: "100%",
                },
                { title: "Doctor Name", field: "DOCTOR_NAME" },
                { title: "Appointment Fee", field: "APPOINTMENT_FEE" },
                {
                  title: "Payment Type",
                  field: "APPOINTMENT_FEE_PAID_TYPE",
                },
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
              components={{ Pagination: PatchedPagination }}
              options={{
                actionsColumnIndex: -1,
                paging: true,
                pageSize: 10, // make initial page size
                emptyRowsWhenPaging: false, // To avoid of having empty rows
                pageSizeOptions: [10, 30, 50, 100], // rows selection options
              }}
            />
          </>
        ) : (
          <LoadingScreen />
        )}
      </PageHeader>
    </div>
  );
}
