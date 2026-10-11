import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboardClient />
    </AdminGuard>
  );
}
