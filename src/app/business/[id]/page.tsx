import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const business = await prisma.business.findUnique({
    where: { id: params.id },
    select: { name: true, slug: true },
  });

  return {
    title: business?.name || "Business",
  };
}

export default async function BusinessRedirectPage({
  params,
}: {
  params: { id: string };
}) {
  const business = await prisma.business.findUnique({
    where: { id: params.id },
    select: { slug: true },
  });

  if (!business) {
    redirect("/listings");
  }

  redirect(`/listing-stay-detail/${business.slug}`);
}
