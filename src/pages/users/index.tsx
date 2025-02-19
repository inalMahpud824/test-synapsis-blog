import TableUsers from "@/components/Fragments/TableUsers";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function Users() {
  return (
    <DashboardLayout active="2">
      <TableUsers />
    </DashboardLayout>
  );
}
