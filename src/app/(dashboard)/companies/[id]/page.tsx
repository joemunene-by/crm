import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteCompany } from "@/app/actions/contacts";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await prisma.company.findUnique({
    where: { id },
    include: { contacts: true, deals: true },
  });

  if (!company) {
    notFound();
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            {company.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{company.industry}</p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Link
            href={`/companies/${company.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Edit
          </Link>
          <form action={deleteCompany.bind(null, company.id)}>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Industry</dt>
                <dd className="mt-1 text-sm text-gray-900">{company.industry || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Website</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {company.website ? (
                    <a href={company.website} className="text-indigo-600 hover:text-indigo-500">
                      {company.website}
                    </a>
                  ) : "-" }
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{company.phone || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{company.email || "-"}</dd>
              </div>
              {company.address && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{company.address}</dd>
                </div>
              )}
            </dl>
          </div>

          {company.notes && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{company.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
              <Link href="/contacts/new" className="text-sm text-indigo-600 hover:text-indigo-500">
                Add contact
              </Link>
            </div>
            {company.contacts.length === 0 ? (
              <p className="text-sm text-gray-500">No contacts yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {company.contacts.map((contact) => (
                  <li key={contact.id} className="py-3">
                    <Link href={`/contacts/${contact.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      {contact.firstName} {contact.lastName}
                    </Link>
                    <p className="text-sm text-gray-500">{contact.position}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Deals</h3>
              <Link href="/deals/new" className="text-sm text-indigo-600 hover:text-indigo-500">
                Add deal
              </Link>
            </div>
            {company.deals.length === 0 ? (
              <p className="text-sm text-gray-500">No deals yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {company.deals.map((deal) => (
                  <li key={deal.id} className="py-3">
                    <Link href={`/deals/${deal.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      {deal.title}
                    </Link>
                    <p className="text-sm text-gray-500">${deal.value.toLocaleString()} - {deal.stage}</p>
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
