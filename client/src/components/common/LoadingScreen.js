import { CircularProgress } from "@material-ui/core";
import React from "react";

const LoadingScreen = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "500px",
      }}
    >
      <CircularProgress size={80} />
    </div>
  );
};

export default LoadingScreen;
