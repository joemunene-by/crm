export async function updateTask(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const dueDate = formData.get("dueDate") as string;

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
  redirect(`/tasks/${id}`);
}