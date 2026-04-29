import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Settings
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.name || "Not set"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.role}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-600">Total Contacts</p>
              <p className="text-2xl font-bold text-blue-900">
                {/* This would need an API call - simplified for now */}
                -
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm font-medium text-green-600">Active Deals</p>
              <p className="text-2xl font-bold text-green-900">-</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-yellow-900">-</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
          <div className="border border-red-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                <p className="text-sm text-gray-500">Permanently delete your account and all associated data.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
