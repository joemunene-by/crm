import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteDeal } from "@/app/actions/contacts";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: { contact: true, company: true, tasks: true },
  });

  if (!deal) {
    notFound();
  }

  const stageColors: Record<string, string> = {
    lead: "bg-gray-100 text-gray-800",
    qualified: "bg-blue-100 text-blue-800",
    proposal: "bg-yellow-100 text-yellow-800",
    negotiation: "bg-orange-100 text-orange-800",
    "closed-won": "bg-green-100 text-green-800",
    "closed-lost": "bg-red-100 text-red-800",
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            {deal.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            ${deal.value.toLocaleString()} - {deal.company?.name}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Link
            href={`/deals/${deal.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Edit
          </Link>
          <form action={deleteDeal.bind(null, deal.id)}>
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
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deal Information</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Value</dt>
                <dd className="mt-1 text-sm text-gray-900">${deal.value.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Stage</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stageColors[deal.stage] || stageColors.lead}`}>
                    {deal.stage}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Probability</dt>
                <dd className="mt-1 text-sm text-gray-900">{deal.probability}%</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{deal.status}</dd>
              </div>
              {deal.expectedCloseDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Expected Close</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(deal.expectedCloseDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {deal.notes && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{deal.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {deal.contact && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>
              <Link href={`/contacts/${deal.contact.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {deal.contact.firstName} {deal.contact.lastName}
              </Link>
              <p className="text-sm text-gray-500">{deal.contact.email}</p>
            </div>
          )}

          {deal.company && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company</h3>
              <Link href={`/companies/${deal.company.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {deal.company.name}
              </Link>
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
              <Link href="/tasks/new" className="text-sm text-indigo-600 hover:text-indigo-500">
                Add task
              </Link>
            </div>
            {deal.tasks.length === 0 ? (
              <p className="text-sm text-gray-500">No tasks yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {deal.tasks.map((task) => (
                  <li key={task.id} className="py-3">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">Priority: {task.priority}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
