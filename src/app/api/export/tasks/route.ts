import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const tasks = await prisma.task.findMany({ where });

    const csv = [
      ["Title", "Description", "Status", "Priority", "Due Date", "Created At"].join(","),
      ...tasks.map((t) =>
        [t.title, t.description || "", t.status, t.priority, t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "", new Date(t.createdAt).toLocaleDateString()].map((field) => `"${field}"`).join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="tasks.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to export tasks" }, { status: 500 });
  }
}
