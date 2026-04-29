"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity } from "@/types";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call":
        return "📞";
      case "email":
        return "✉️";
      case "meeting":
        return "🤝";
      case "note":
        return "📝";
      default:
        return "📌";
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Activities
          </h2>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : activities.length === 0 ? (
          <p className="p-4 text-gray-500 text-sm">No activities yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <li key={activity.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{activity.type}</span>
                      {activity.contact && (
                        <Link
                          href={`/contacts/${activity.contactId}`}
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          {activity.contact.firstName} {activity.contact.lastName}
                        </Link>
                      )}
                      <span>{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
