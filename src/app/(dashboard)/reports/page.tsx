"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

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
  const [dealsByStage, setDealsByStage] = useState<Record<string, number>>({});
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

        const stageCount: Record<string, number> = {};
        deals.forEach((deal: any) => {
          stageCount[deal.stage] = (stageCount[deal.stage] || 0) + 1;
        });

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
        setDealsByStage(stageCount);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const winRate = stats.totalDeals > 0 
    ? ((stats.wonDeals / (stats.wonDeals + stats.lostDeals)) * 100).toFixed(1)
    : "0";

  const stageColors: Record<string, string> = {
    lead: "#9CA3AF",
    qualified: "#3B82F6",
    proposal: "#F59E0B",
    negotiation: "#F97316",
    "closed-won": "#10B981",
    "closed-lost": "#EF4444",
  };

  const pieData = Object.entries(dealsByStage).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace("-", " "),
    value,
    color: stageColors[name] || "#9CA3AF",
  }));

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
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
              <dd className="text-lg font-medium text-gray-900">{stats.totalContacts}</dd>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Companies</dt>
              <dd className="text-lg font-medium text-gray-900">{stats.totalCompanies}</dd>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Deals</dt>
              <dd className="text-lg font-medium text-gray-900">{stats.totalDeals}</dd>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Win Rate</dt>
              <dd className="text-lg font-medium text-gray-900">{winRate}%</dd>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Deals by Stage</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm">No deal data yet.</p>
              )}
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
}
