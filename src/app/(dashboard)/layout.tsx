import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "@components/SearchBar";
import ToastHandler from "@components/ToastHandler";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const linkClass = (path: string) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      isActive(path)
        ? "border-indigo-500 text-gray-900"
        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastHandler />
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">CRM</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/dashboard" className={linkClass("/dashboard")}>
                  Dashboard
                </Link>
                <Link href="/contacts" className={linkClass("/contacts")}>
                  Contacts
                </Link>
                <Link href="/companies" className={linkClass("/companies")}>
                  Companies
                </Link>
                <Link href="/deals" className={linkClass("/deals")}>
                  Deals
                </Link>
                <Link href="/tasks" className={linkClass("/tasks")}>
                  Tasks
                </Link>
                <Link href="/reports" className={linkClass("/reports")}>
                  Reports
                </Link>
                <Link href="/activities" className={linkClass("/activities")}>
                  Activities
                </Link>
                <Link href="/settings" className={linkClass("/settings")}>
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <SearchBar />
            </div>
            <div className="flex items-center">
              <Link
                href="/api/auth/signout"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
