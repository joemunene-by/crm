"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Contact, Deal, Task } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    pendingTasks: 0,
    pipelineValue: 0,
  });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/contacts").then((res) => res.json()),
      fetch("/api/deals").then((res) => res.json()),
      fetch("/api/tasks").then((res) => res.json()),
    ])
      .then(([contacts, deals, tasks]) => {
        const activeDeals = deals.filter((d: Deal) => d.status === "open");
        const pendingTasks = tasks.filter((t: Task) => t.status === "pending");
        const pipelineValue = activeDeals.reduce((sum: number, deal: Deal) => sum + deal.value, 0);

        setStats({
          totalContacts: contacts.length,
          activeDeals: activeDeals.length,
          pendingTasks: pendingTasks.length,
          pipelineValue,
        });

        setRecentContacts(contacts.slice(0, 5));
        setUpcomingTasks(pendingTasks.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/contacts/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Contact
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                  <dd className="text-lg font-medium text-gray-900">{loading ? "..." : stats.totalContacts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">D</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Deals</dt>
                  <dd className="text-lg font-medium text-gray-900">{loading ? "..." : stats.activeDeals}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                  <dd className="text-lg font-medium text-gray-900">{loading ? "..." : stats.pendingTasks}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">$</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pipeline Value</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? "..." : `$${stats.pipelineValue.toLocaleString()}`}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Contacts</h3>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : recentContacts.length === 0 ? (
            <p className="text-gray-500 text-sm">No contacts yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentContacts.map((contact) => (
                <li key={contact.id} className="py-3">
                  <p className="text-sm font-medium text-indigo-600">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Tasks</h3>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {upcomingTasks.map((task) => (
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
  );
}
