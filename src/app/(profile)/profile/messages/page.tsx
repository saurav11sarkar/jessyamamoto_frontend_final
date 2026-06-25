import React from "react";
import MessagingPage from "./_components/MessagingPage";

const page = ({
  searchParams,
}: {
  searchParams?: { id?: string };
}) => {
  return (
    <div>
      <MessagingPage initialConversationId={searchParams?.id} />
    </div>
  );
};

export default page;
