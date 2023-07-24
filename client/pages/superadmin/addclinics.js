import "date-fns";
import "react-phone-number-input/style.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SuperAdminPageHeader from "../../src/components/superadmin_components/SuperAdminHeader";
import {
  PatchedPagination,
  tableIcons,
} from "../../src/components/common/ReuseableTable";
import ReuseableModal from "../../src/components/common/ReuseableModal";
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
import { fetchAPIData, getAge } from "../../src/utils/Common";
import EditIcon from "@material-ui/icons/Edit";
import MaterialTable from "material-table";
import LoadingScreen from "../../src/components/common/LoadingScreen";
import Protected from "../../src/components/authentication/Protected";
import PhoneInput from "react-phone-number-input";
import PhoneNumberInput from "../../src/components/common/PhoneNumberInput";

const AddClinics = () => {
  const [open, setOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [clinics, setClinics] = useState([]);
  const [clinicName, setClinicName] = useState("");
  const [clinicID, setClinicID] = useState("");
  const [editClinic, setEditClinic] = useState(false);
  const [clinicStatus, setClinicStatus] = useState("Y");
  const [clinicPhoneNumber, setClinicPhoneNumber] = useState();
  const [clinicEmail, setClinicEmail] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicTheme, setClinicTheme] = useState("");

  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    setEditClinic(false);
    setClinicName("");
    setClinicStatus("Y");
    setClinicPhoneNumber("");
    setClinicEmail("");
    setClinicAddress("");
    setClinicTheme("");
    setClinicID("");
    setOpen(true);
  };
  const handleEditOpen = (e, rowData) => {
    console.log(rowData);
    setEditClinic(true);
    setClinicName(rowData.CLINIC_NAME);
    setClinicStatus(rowData.CLINIC_STATUS);
    setClinicPhoneNumber(rowData.CLINIC_PHONE);
    setClinicEmail(rowData.CLINIC_EMAIL);
    setClinicAddress(rowData.CLINIC_ADDRESS);
    setClinicTheme(rowData.CLINIC_THEME);
    setClinicID(rowData.ID);
    setOpen(true);
  };

  const handlePatient = (e) => {
    setModalLoading(true);
    e.preventDefault();
    const formData = {
      clinicName,
      clinicStatus,
      clinicPhoneNumber,
      clinicEmail,
      clinicAddress,
      clinicTheme,
    };
    if (!editClinic) {
      fetchAPIData("/addclinic", formData, "POST").then((json) => {
        console.log(json);
        if (json.status === "Success") {
          handleClose();
          setModalLoading(false);
          setTableLoading(true);
          getAllClinics();
        } else {
          // notify(json.message);
          // setShowSnackbar(true);
          // setLoading(false);
        }
      });
    } else {
      formData["clinicID"] = clinicID;
      fetchAPIData("/editclinic", formData, "POST").then((json) => {
        console.log(json);
        if (json.status === "Success") {
          handleClose();
          setModalLoading(false);
          setTableLoading(true);
          getAllClinics();
        } else {
          // notify(json.message);
          // setShowSnackbar(true);
          // setLoading(false);
        }
      });
    }
  };

  const getAllClinics = () => {
    fetchAPIData("/getallclinics", "", "GET").then((json) => {
      setClinics(json.clinics);
      setTableLoading(false);
    });
  };

  useEffect(() => {
    getAllClinics();
  }, []);

  return (
    <div>
      <SuperAdminPageHeader>
        {!tableLoading ? (
          <MaterialTable
            title="Clinic List"
            data={clinics}
            columns={[
              {
                title: "Clinic Name",
                field: "CLINIC_NAME",
              },
              {
                title: "Clinic Email",
                field: "CLINIC_EMAIL",
              },
              {
                title: "Clinic Phone",
                field: "CLINIC_PHONE",
              },
              {
                title: "Clinic Address",
                field: "CLINIC_ADDRESS",
              },
              {
                title: "Clinic Theme",
                field: "CLINIC_THEME",
                render: (rowData) => (
                  <Chip
                    size="small"
                    label={rowData.CLINIC_THEME}
                    style={{
                      backgroundColor: `${rowData.CLINIC_THEME}`,
                      color: "white",
                    }}
                  />
                ),
              },
              {
                title: "Clinic Status",
                field: "CLINIC_STATUS",
                render: (rowData) => {
                  return rowData.CLINIC_STATUS == "Y" ? (
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
              {
                title: "Created On",
                field: "CLINIC_CREATED_ON",
              },
            ]}
            actions={[
              {
                icon: () => <AddBox />,
                tooltip: "Add Clinic",
                isFreeAction: true,
                onClick: (event) => handleOpen(),
              },
              {
                icon: () => <EditIcon />,
                tooltip: "Edit Clinic",
                onClick: (event, rowData) => handleEditOpen(event, rowData),
              },
            ]}
            icons={tableIcons}
            components={{ Pagination: PatchedPagination }}
            options={{
              actionsColumnIndex: -1,
              paging: true,
              pageSize: 10,
              emptyRowsWhenPaging: false,
              pageSizeOptions: [10, 30, 50, 100],
            }}
          />
        ) : (
          <LoadingScreen />
        )}

        <ReuseableModal
          open={open}
          handleClose={handleClose}
          dialogTitle={`${!editClinic ? "Add" : "Edit"} a Clinic`}
          loading={modalLoading}
          loadingTitle={`${!editClinic ? "Adding" : "Editing"} a Clinic...`}
        >
          <form onSubmit={handlePatient}>
            <TextField
              label="Name"
              variant="outlined"
              style={{ width: "100%", marginBottom: "15px" }}
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
              autoComplete="off"
              size="small"
            />
            <PhoneInput
              style={{ width: "100%", marginBottom: "15px" }}
              value={clinicPhoneNumber}
              onChange={(e) => setClinicPhoneNumber(e)}
              inputComponent={PhoneNumberInput}
              defaultCountry="IN"
              label="Phone Number"
              limitMaxLength={true}
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              style={{ width: "100%", marginBottom: "15px" }}
              value={clinicEmail}
              onChange={(e) => setClinicEmail(e.target.value)}
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
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
              required
              size="small"
            />
            <TextField
              label="Theme"
              variant="outlined"
              style={{ width: "100%", marginBottom: "5px" }}
              value={clinicTheme}
              onChange={(e) => setClinicTheme(e.target.value)}
              required
              autoComplete="off"
              size="small"
              type="color"
            />
            <RadioGroup
              row
              value={clinicStatus}
              onChange={(e) => setClinicStatus(e.target.value)}
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
      </SuperAdminPageHeader>
    </div>
  );
};

export default Protected(AddClinics);
