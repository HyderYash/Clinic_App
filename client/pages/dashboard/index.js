import "date-fns";
import React from "react";
import PageHeader from "../../src/components/common/PageHeader";
import Protected from "../../src/components/authentication/Protected";

const Dashboard = () => {
  return (
    <div>
      <PageHeader>
        <h1 style={{ textAlign: "center" }}>DASHBOARD</h1>
      </PageHeader>
    </div>
  );
};

export default Protected(Dashboard);
