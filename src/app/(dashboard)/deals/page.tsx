import Link from "next/link";

const stages = [
  { id: "lead", name: "Lead", color: "bg-gray-100" },
  { id: "qualified", name: "Qualified", color: "bg-blue-100" },
  { id: "proposal", name: "Proposal", color: "bg-yellow-100" },
  { id: "negotiation", name: "Negotiation", color: "bg-orange-100" },
  { id: "closed-won", name: "Closed Won", color: "bg-green-100" },
  { id: "closed-lost", name: "Closed Lost", color: "bg-red-100" },
];

export default function DealsPage() {
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Deals Pipeline
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/deals/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Deal
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.map((stage) => (
          <div key={stage.id} className={`${stage.color} rounded-lg p-4`}>
            <h3 className="text-sm font-medium text-gray-900 mb-3">{stage.name}</h3>
            <p className="text-gray-500 text-sm">No deals</p>
          </div>
        ))}
      </div>
    </div>
  );
}
