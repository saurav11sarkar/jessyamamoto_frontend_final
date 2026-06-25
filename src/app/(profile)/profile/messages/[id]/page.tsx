import React from "react";
import MessagingPage from "../_components/MessagingPage";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <MessagingPage initialConversationId={params.id} />
    </div>
  );
};

export default page;
