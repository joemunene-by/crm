"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalCompanies: 0,
    totalDeals: 0,
    totalTasks: 0,
    wonDeals: 0,
    lostDeals: 0,
    totalValue: 0,
    avgDealSize: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/contacts").then((res) => res.json()),
      fetch("/api/companies").then((res) => res.json()),
      fetch("/api/deals").then((res) => res.json()),
      fetch("/api/tasks").then((res) => res.json()),
    ])
      .then(([contacts, companies, deals, tasks]) => {
        const wonDeals = deals.filter((d: any) => d.stage === "closed-won");
        const lostDeals = deals.filter((d: any) => d.stage === "closed-lost");
        const totalValue = deals.reduce((sum: number, d: any) => sum + d.value, 0);
        const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0;

        setStats({
          totalContacts: contacts.length,
          totalCompanies: companies.length,
          totalDeals: deals.length,
          totalTasks: tasks.length,
          wonDeals: wonDeals.length,
          lostDeals: lostDeals.length,
          totalValue,
          avgDealSize,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const winRate = stats.totalDeals > 0 
    ? ((stats.wonDeals / (stats.wonDeals + stats.lostDeals)) * 100).toFixed(1)
    : "0";

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Reports & Analytics
          </h2>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading reports...</p>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalContacts}</dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Companies</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalCompanies}</dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Deals</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalDeals}</dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Win Rate</dt>
                <dd className="text-lg font-medium text-gray-900">{winRate}%</dd>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Summary</h3>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Total Pipeline Value</dt>
                  <dd className="text-sm font-medium text-gray-900">${stats.totalValue.toLocaleString()}</dd>
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

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Task Summary</h3>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Total Tasks</dt>
                  <dd className="text-sm font-medium text-gray-900">{stats.totalTasks}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Pending Tasks</dt>
                  <dd className="text-sm font-medium text-yellow-600">
                    {/* This would need API enhancement */}
                    -
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
