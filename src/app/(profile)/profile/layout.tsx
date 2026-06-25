import React from "react";
import UserDashboardLayout from "./_components/user-dashboard-layout";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <UserDashboardLayout>{children}</UserDashboardLayout>;
};

export default layout;
