import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteTask } from "@/app/actions/contacts";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = await prisma.task.findUnique({
    where: { id },
    include: { contact: true, deal: true },
  });

  if (!task) {
    notFound();
  }

  const priorityColors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            {task.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Created {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Edit
          </Link>
          <form action={deleteTask.bind(null, task.id)}>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Task Details</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[task.status] || statusColors.pending}`}>
                    {task.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Priority</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[task.priority] || priorityColors.medium}`}>
                    {task.priority}
                  </span>
                </dd>
              </div>
              {task.dueDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {task.completedAt && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Completed</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(task.completedAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>

            {task.description && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {task.contact && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Related Contact</h3>
              <Link href={`/contacts/${task.contact.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {task.contact.firstName} {task.contact.lastName}
              </Link>
              <p className="text-sm text-gray-500">{task.contact.email}</p>
            </div>
          )}

          {task.deal && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Related Deal</h3>
              <Link href={`/deals/${task.deal.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {task.deal.title}
              </Link>
              <p className="text-sm text-gray-500">${task.deal.value.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
