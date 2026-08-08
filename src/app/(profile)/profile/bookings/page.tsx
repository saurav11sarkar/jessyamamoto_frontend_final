import React, { Suspense } from "react";
import BookingsPage from "./_components/bookings-page";

const page = () => {
  return (
    <div>
      <Suspense fallback={null}>
        <BookingsPage />
      </Suspense>
    </div>
  );
};

export default page;
