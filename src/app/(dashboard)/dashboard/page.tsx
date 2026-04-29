"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Contact, Deal, Task } from "@/types";
import { SkeletonStats, SkeletonTable } from "@/components/Skeletons";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    pendingTasks: 0,
    pipelineValue: 0,
    wonDeals: 0,
    lostDeals: 0,
  });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [dealsByStage, setDealsByStage] = useState<Record<string, number>>({});
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
        const wonDeals = deals.filter((d: Deal) => d.stage === "closed-won").length;
        const lostDeals = deals.filter((d: Deal) => d.stage === "closed-lost").length;

        const stageCount: Record<string, number> = {};
        deals.forEach((deal: Deal) => {
          stageCount[deal.stage] = (stageCount[deal.stage] || 0) + 1;
        });

        setStats({
          totalContacts: contacts.length,
          activeDeals: activeDeals.length,
          pendingTasks: pendingTasks.length,
          pipelineValue,
          wonDeals,
          lostDeals,
        });

        setDealsByStage(stageCount);
        setRecentContacts(contacts.slice(0, 5));
        setUpcomingTasks(pendingTasks.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stages = [
    { id: "lead", name: "Lead", color: "bg-gray-500" },
    { id: "qualified", name: "Qualified", color: "bg-blue-500" },
    { id: "proposal", name: "Proposal", color: "bg-yellow-500" },
    { id: "negotiation", name: "Negotiation", color: "bg-orange-500" },
    { id: "closed-won", name: "Closed Won", color: "bg-green-500" },
    { id: "closed-lost", name: "Closed Lost", color: "bg-red-500" },
  ];

  return (
    <div>
      {loading ? (
        <div className="space-y-6">
          <SkeletonStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonTable rows={5} />
          </div>
          <SkeletonTable rows={5} />
        </div>
      ) : (
      <div>
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
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
                    <dd className="text-lg font-medium text-gray-900">{stats.totalContacts}</dd>
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
                    <dd className="text-lg font-medium text-gray-900">{stats.activeDeals}</dd>
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
                    <dd className="text-lg font-medium text-gray-900">{stats.pendingTasks}</dd>
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
                      ${stats.pipelineValue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deals by Stage</h3>
            {Object.keys(dealsByStage).length === 0 ? (
              <p className="text-gray-500 text-sm">No deals yet.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(dealsByStage).map(([stage, count]) => (
                  <div key={stage} className="flex items-center">
                    <div className={`w-3 h-3 ${getStageColor(stage)} rounded-full mr-3`}></div>
                    <span className="text-sm text-gray-700 w-32">{stage.charAt(0).toUpperCase() + stage.slice(1)}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 ml-2">
                      <div
                        className={`h-4 rounded-full ${getStageColor(stage)}`}
                        style={{ width: `${count / Math.max(...Object.values(dealsByStage), 1) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 ml-3">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Summary</h3>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Total Pipeline Value</dt>
                <dd className="text-sm font-medium text-gray-900">${stats.pipelineValue.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Average Deal Size</dt>
                <dd className="text-sm font-medium text-gray-900">${stats.avgDealSize.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Won Deals</dt>
                <dd className="text-sm font-medium text-green-600">{stats.wonDeals}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Lost Deals</dt>
                <dd className="text-sm font-medium text-red-600">{stats.lostDeals}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Contacts</h3>
          {recentContacts.length === 0 ? (
            <p className="text-gray-500 text-sm">No contacts yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentContacts.map((contact) => (
                <li key={contact.id} className="py-3">
                  <Link href={`/contacts/${contact.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    {contact.firstName} {contact.lastName}
                  </Link>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Tasks</h3>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="py-3 flex items-center justify-between">
                  <div>
                    <Link href={`/tasks/${task.id}`} className="text-sm font-medium text-gray-900 hover:text-indigo-500">
                      {task.title}
                    </Link>
                    <p className="text-sm text-gray-500">Priority: {task.priority}</p>
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      ))}
    </div>
  );
}
