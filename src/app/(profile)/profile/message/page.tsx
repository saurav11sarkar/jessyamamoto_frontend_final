import { redirect } from "next/navigation";

const page = ({
  searchParams,
}: {
  searchParams?: { id?: string };
}) => {
  const target = searchParams?.id
    ? `/profile/messages?id=${searchParams.id}`
    : "/profile/messages";

  redirect(target);
};

export default page;
