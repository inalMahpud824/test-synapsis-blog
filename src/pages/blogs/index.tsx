import TablePosts from "@/components/Fragments/TablePosts";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function Blogs() {
  return (
    <DashboardLayout active="1">
      <TablePosts />
    </DashboardLayout>
  );
}
