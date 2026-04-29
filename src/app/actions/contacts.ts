export async function updateCompany(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const industry = formData.get("industry") as string;
  const website = formData.get("website") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const notes = formData.get("notes") as string;

  await prisma.company.update({
    where: { id },
    data: {
      name,
      industry: industry || null,
      website: website || null,
      phone: phone || null,
      email: email || null,
      address: address || null,
      notes: notes || null,
    },
  });

  revalidatePath(`/companies/${id}`);
  redirect(`/companies/${id}`);
}

export async function updateDeal(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const value = parseFloat(formData.get("value") as string) || 0;
  const stage = formData.get("stage") as string;
  const probability = parseInt(formData.get("probability") as string) || 0;
  const expectedCloseDate = formData.get("expectedCloseDate") as string;
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;

  await prisma.deal.update({
    where: { id },
    data: {
      title,
      value,
      stage,
      probability,
      expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
      status,
      notes: notes || null,
    },
  });

  revalidatePath(`/deals/${id}`);
  redirect(`/deals/${id}`);
}