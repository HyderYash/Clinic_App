import "date-fns";
import "react-phone-number-input/style.css";
import React, { useEffect, useState } from "react";
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
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@material-ui/core";
import { fetchAPIData } from "../../src/utils/Common";
import EditIcon from "@material-ui/icons/Edit";
import MaterialTable from "material-table";
import LoadingScreen from "../../src/components/common/LoadingScreen";
import Protected from "../../src/components/authentication/Protected";

const AddClinicUsers = () => {
  const [open, setOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [clinicUsers, setClinicUsers] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [userName, setUserName] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");
  const [userID, setUserID] = useState("");
  const [editUser, setEditUser] = useState(false);
  const [userStatus, setUserStatus] = useState("Y");
  const [userType, setUserType] = useState("D");
  const [userEmail, setUserEmail] = useState("");
  const [clinicUserClinicID, setClinicUserClinicID] = useState("");

  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    setEditUser(false);
    setUserName("");
    setUserDisplayName("");
    setUserStatus("Y");
    setUserType("D");
    setUserEmail("");
    setClinicUserClinicID("");
    setUserID("");
    setOpen(true);
  };
  const handleEditOpen = (e, rowData) => {
    console.log(rowData);
    setEditUser(true);
    setUserName(rowData.USER_NAME);
    setUserDisplayName(rowData.USER_DISPLAY_NAME);
    setUserStatus(rowData.USER_STATUS);
    setUserType(rowData.USER_TYPE);
    setUserEmail(rowData.USER_EMAIL);
    setClinicUserClinicID(rowData.CLINIC_ID);
    setUserID(rowData.ID);
    setOpen(true);
  };

  const handleClinicUser = (e) => {
    setModalLoading(true);
    e.preventDefault();
    const formData = {
      userName,
      userStatus,
      userEmail,
      userDisplayName,
      userType,
      clinicUserClinicID,
    };
    console.log(formData);
    if (!editUser) {
      fetchAPIData("/addclinicuser", formData, "POST").then((json) => {
        console.log(json);
        if (json.status === "Success") {
          handleClose();
          setModalLoading(false);
          setTableLoading(true);
          getAllUsers();
        } else {
          // notify(json.message);
          // setShowSnackbar(true);
          // setLoading(false);
        }
      });
    } else {
      formData["userID"] = userID;
      fetchAPIData("/editclinicuser", formData, "POST").then((json) => {
        console.log(json);
        if (json.status === "Success") {
          handleClose();
          setModalLoading(false);
          setTableLoading(true);
          getAllUsers();
        } else {
          // notify(json.message);
          // setShowSnackbar(true);
          // setLoading(false);
        }
      });
    }
  };

  const getAllUsers = () => {
    fetchAPIData("/getallusers", "", "GET").then((json) => {
      setClinicUsers(json.users);
      setTableLoading(false);
    });
  };

  const getAllClinics = () => {
    fetchAPIData("/getallclinics", "", "GET").then((json) => {
      setClinics(json.clinics);
      setTableLoading(false);
    });
  };

  useEffect(() => {
    getAllUsers();
    getAllClinics();
  }, []);

  return (
    <div>
      <SuperAdminPageHeader>
        {!tableLoading ? (
          <MaterialTable
            title="Clinic User List"
            data={clinicUsers}
            columns={[
              {
                title: "Username",
                field: "USER_NAME",
              },
              {
                title: "Display Name",
                field: "USER_DISPLAY_NAME",
              },
              {
                title: "Email",
                field: "USER_EMAIL",
              },
              {
                title: "Avatar Color",
                field: "USER_AVATAR_COLOR",
                render: (rowData) => (
                  <Chip
                    size="small"
                    label={rowData.USER_AVATAR_COLOR}
                    style={{
                      backgroundColor: `${rowData.USER_AVATAR_COLOR}`,
                      color: "white",
                    }}
                  />
                ),
              },
              {
                title: "Type",
                field: "USER_TYPE",
                render: (rowData) => {
                  return rowData.USER_TYPE == "D" ? (
                    <Chip
                      size="small"
                      label="Doctor"
                      style={{ backgroundColor: "blue", color: "white" }}
                    />
                  ) : (
                    <Chip
                      size="small"
                      label="Receptionist"
                      style={{ backgroundColor: "orange", color: "white" }}
                    />
                  );
                },
              },
              {
                title: "Status",
                field: "USER_STATUS",
                render: (rowData) => {
                  return rowData.USER_STATUS == "Y" ? (
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
                title: "Clinic Name",
                field: "CLINIC_NAME",
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
          dialogTitle={`${!editUser ? "Add" : "Edit"} a Clinic User`}
          dialogContent={() => <AddPatientContent />}
          loading={modalLoading}
          loadingTitle={`${!editUser ? "Adding" : "Editing"} a Clinic User...`}
        >
          <form onSubmit={handleClinicUser}>
            <TextField
              label="Username"
              variant="outlined"
              style={{ width: "100%", marginBottom: "15px" }}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              autoComplete="off"
              size="small"
            />
            <TextField
              label="Display Name"
              variant="outlined"
              style={{ width: "100%", marginBottom: "15px" }}
              value={userDisplayName}
              onChange={(e) => setUserDisplayName(e.target.value)}
              required
              autoComplete="off"
              size="small"
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              style={{ width: "100%", marginBottom: "15px" }}
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              autoComplete="off"
              size="small"
            />
            <FormControl
              variant="outlined"
              style={{ width: "100%" }}
              size="small"
            >
              <InputLabel>Clinic</InputLabel>
              <Select
                value={clinicUserClinicID}
                onChange={(e) => setClinicUserClinicID(e.target.value)}
                label="Select Clinic"
              >
                {clinics.map((item) => (
                  <MenuItem value={item.ID} key={item.ID}>
                    {item.CLINIC_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <RadioGroup
              row
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <FormControlLabel
                color="blue"
                value="D"
                control={<Radio />}
                label="Doctor"
              />
              <FormControlLabel
                color="red"
                value="R"
                control={<Radio />}
                label="Receptionist"
              />
            </RadioGroup>
            <RadioGroup
              row
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
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

export default Protected(AddClinicUsers);
