import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateDeal } from "@/app/actions/contacts";

export default async function EditDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await prisma.deal.findUnique({
    where: { id },
  });

  if (!deal) {
    notFound();
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Edit Deal
          </h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form action={updateDeal.bind(null, id)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Deal Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                defaultValue={deal.title}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                Value ($)
              </label>
              <input
                type="number"
                name="value"
                id="value"
                defaultValue={deal.value}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
                Stage
              </label>
              <select
                name="stage"
                id="stage"
                defaultValue={deal.stage}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="lead">Lead</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
              </select>
            </div>

            <div>
              <label htmlFor="probability" className="block text-sm font-medium text-gray-700">
                Probability (%)
              </label>
              <input
                type="number"
                name="probability"
                id="probability"
                min="0"
                max="100"
                defaultValue={deal.probability}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="expectedCloseDate" className="block text-sm font-medium text-gray-700">
                Expected Close Date
              </label>
              <input
                type="date"
                name="expectedCloseDate"
                id="expectedCloseDate"
                defaultValue={deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                id="status"
                defaultValue={deal.status}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              defaultValue={deal.notes || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <a
              href={`/deals/${deal.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Update Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
