"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteContact(id: string) {
  await prisma.contact.delete({
    where: { id },
  });
  revalidatePath("/contacts");
  redirect("/contacts");
}

export async function deleteCompany(id: string) {
  await prisma.company.delete({
    where: { id },
  });
  revalidatePath("/companies");
  redirect("/companies");
}

export async function deleteDeal(id: string) {
  await prisma.deal.delete({
    where: { id },
  });
  revalidatePath("/deals");
  redirect("/deals");
}

export async function deleteTask(id: string) {
  await prisma.task.delete({
    where: { id },
  });
  revalidatePath("/tasks");
  redirect("/tasks");
}
