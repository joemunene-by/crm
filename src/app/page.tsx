import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">CRM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            <span className="block">Modern CRM for</span>
            <span className="block text-indigo-600">Growing Businesses</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
            A high-end customer relationship management system built with the latest technology. 
            Manage contacts, track deals, and boost your sales pipeline.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              Enter Dashboard
            </Link>
            <Link
              href="https://github.com/joemunene-by/crm"
              target="_blank"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "👥", title: "Contact Management", desc: "Organize and track all your customer relationships" },
            { icon: "🏢", title: "Company Tracking", desc: "Manage company profiles and associated contacts" },
            { icon: "💰", title: "Deals Pipeline", desc: "Visual pipeline with stages and probability tracking" },
            { icon: "✅", title: "Task Management", desc: "Stay organized with prioritized tasks and due dates" },
            { icon: "📊", title: "Dashboard Analytics", desc: "Get insights with real-time statistics and charts" },
            { icon: "🔐", title: "Secure & Modern", desc: "Built with Next.js, TypeScript, Prisma, and PostgreSQL" },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500">
            Built by <a href="https://github.com/joemunene-by" className="text-indigo-600 hover:text-indigo-500">joemunene-by</a> • 
            <a href="https://github.com/joemunene-by/crm" className="text-indigo-600 hover:text-indigo-500">View on GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
