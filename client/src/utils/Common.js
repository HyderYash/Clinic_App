import jwt_decode from "jwt-decode";

var API_ROOT_PATH = "";
if (process.env.NODE_ENV === "production") {
  API_ROOT_PATH = "";
} else {
  API_ROOT_PATH = "http://localhost:5000/api";
}

const fetchAPIData = async function (
  apiPath,
  params = "",
  method = "POST",
  isLoginPage = false
) {
  let apipara = {
    method: method,
    redirect: "manual",
    mode: "cors",
    headers: {
      Referer: window.location.href,
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };
  if (isLoginPage === false) {
    let userDetails = jwt_decode(sessionStorage.getItem("token"));
    apipara.headers["X-CLINIC_ID"] = userDetails.CLINIC_ID;
  }

  if (method === "POST") {
    if (isLoginPage === false) {
      let userDetails = jwt_decode(sessionStorage.getItem("token"));
      params["USER_ID"] = userDetails.ID;
      params["CLINIC_ID"] = userDetails.CLINIC_ID;
    }
    apipara["body"] = JSON.stringify(params);
  }

  return await new Promise(function (resolve) {
    fetch(API_ROOT_PATH + apiPath, apipara)
      .then(function (response) {
        if (response.status === 200) {
          response.json().then(function (json) {
            resolve(json);
          });
        } else if (response.status === 401) {
          response.json().then(function (json) {
            alert("Your session has expired. Please login again!");
            window.location.href = "/";
          });
        } else {
          window.onerror(JSON.stringify(response));
          resolve(response);
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  });
};

const manipulateTableColumnsTitle = (title) => {
  return title
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, function (letter) {
      return letter.toUpperCase();
    });
};

function appendTimeToDate(dateString, timeString) {
  const appTimeDate = new Date(timeString);
  const appDateDate = new Date(dateString);
  appDateDate.setHours(appTimeDate.getHours());
  appDateDate.setMinutes(appTimeDate.getMinutes());
  appDateDate.setSeconds(appTimeDate.getSeconds());
  const updatedAppDate = appDateDate.toLocaleDateString();
  return updatedAppDate;
}

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export { fetchAPIData, manipulateTableColumnsTitle, appendTimeToDate, getAge };
