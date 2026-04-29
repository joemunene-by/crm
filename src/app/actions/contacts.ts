"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    });
    revalidatePath("/contacts");
    redirect("/contacts?success=Contact+deleted+successfully");
  } catch (error) {
    redirect("/contacts?error=Failed+to+delete+contact");
  }
}

export async function updateContact(id: string, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const company = formData.get("company") as string;
  const position = formData.get("position") as string;
  const status = formData.get("status") as string;
  const source = formData.get("source") as string;
  const notes = formData.get("notes") as string;

  try {
    await prisma.contact.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        company: company || null,
        position: position || null,
        status,
        source: source || null,
        notes: notes || null,
      },
    });

    revalidatePath(`/contacts/${id}`);
    redirect(`/contacts/${id}?success=Contact+updated+successfully`);
  } catch (error) {
    redirect(`/contacts/${id}?error=Failed+to+update+contact`);
  }
}

export async function deleteCompany(id: string) {
  try {
    await prisma.company.delete({
      where: { id },
    });
    revalidatePath("/companies");
    redirect("/companies?success=Company+deleted+successfully");
  } catch (error) {
    redirect("/companies?error=Failed+to+delete+company");
  }
}

export async function deleteDeal(id: string) {
  try {
    await prisma.deal.delete({
      where: { id },
    });
    revalidatePath("/deals");
    redirect("/deals?success=Deal+deleted+successfully");
  } catch (error) {
    redirect("/deals?error=Failed+to+delete+deal");
  }
}

export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({
      where: { id },
    });
    revalidatePath("/tasks");
    redirect("/tasks?success=Task+deleted+successfully");
  } catch (error) {
    redirect("/tasks?error=Failed+to+delete+task");
  }
}

export async function updateTask(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const dueDate = formData.get("dueDate") as string;

  try {
    await prisma.task.update({
      where: { id },
      data: {
        title,
        description: description || null,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    revalidatePath(`/tasks/${id}`);
    redirect(`/tasks/${id}?success=Task+updated+successfully`);
  } catch (error) {
    redirect(`/tasks/${id}?error=Failed+to+update+task`);
  }
}
