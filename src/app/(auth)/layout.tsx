import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dffcf9_0%,#f7fffe_34%,#ffffff_68%)]">
      {children}
    </div>
  );
};

export default Layout;
