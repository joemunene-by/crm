# CRM - High-End Customer Relationship Management

A modern, full-featured CRM built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- **Contact Management**: Store and manage customer contacts with detailed information
- **Company Management**: Track companies and their associated contacts
- **Deals Pipeline**: Visual pipeline with stages (Lead → Qualified → Proposal → Negotiation → Closed)
- **Task Management**: Create and track tasks with priorities and due dates
- **Activity Tracking**: Log calls, emails, and meetings
- **Dashboard**: Overview of key metrics and recent activities
- **Authentication**: Secure login with NextAuth

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joemunene-by/crm.git
cd crm
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/crm?schema=public"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
```

5. (Optional) Seed the database with sample data:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Schema

The CRM uses the following data models:
- **User**: System users with authentication
- **Contact**: Customer contacts with status tracking
- **Company**: Company records with industry details
- **Deal**: Sales opportunities with pipeline stages
- **Task**: Action items with priorities
- **Activity**: Interaction history (calls, emails, meetings)

## API Routes

- `GET/POST /api/contacts` - Manage contacts
- `GET/POST /api/companies` - Manage companies
- `GET/POST /api/deals` - Manage deals
- `GET/POST /api/tasks` - Manage tasks
- `GET/POST /api/activities` - Track activities

## License

MIT

## Author

**joemunene-by** - [GitHub](https://github.com/joemunene-by)
