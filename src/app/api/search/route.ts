import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const [contacts, companies, deals] = await Promise.all([
      prisma.contact.findMany({
        where: {
          OR: [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
      }),
      prisma.company.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
        },
        take: 5,
      }),
      prisma.deal.findMany({
        where: {
          title: { contains: query, mode: "insensitive" },
        },
        take: 5,
      }),
    ]);

    const results = [
      ...contacts.map((c) => ({
        type: "contact",
        id: c.id,
        title: `${c.firstName} ${c.lastName}`,
        subtitle: c.email || c.company || "",
        url: `/contacts/${c.id}`,
      })),
      ...companies.map((c) => ({
        type: "company",
        id: c.id,
        title: c.name,
        subtitle: c.industry || "",
        url: `/companies/${c.id}`,
      })),
      ...deals.map((d) => ({
        type: "deal",
        id: d.id,
        title: d.title,
        subtitle: `$${d.value.toLocaleString()}`,
        url: `/deals/${d.id}`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
