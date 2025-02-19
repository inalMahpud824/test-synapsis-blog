import PostDetail from "@/components/Fragments/PostDetail";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRouter } from "next/router";

export default function BlogsDetail() {
  const router = useRouter();
  const { id } = router.query; 
  if (typeof id !== 'string') {
    return null;
  }
  return (
    <DashboardLayout active="1">
      <PostDetail id={id} />
    </DashboardLayout>
  );
}