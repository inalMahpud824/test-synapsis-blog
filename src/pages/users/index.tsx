import TablePosts from "@/components/Fragments/TablePosts";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function Users() {
  return (
    <DashboardLayout active="2">
      <TablePosts />
    </DashboardLayout>
  );
}
