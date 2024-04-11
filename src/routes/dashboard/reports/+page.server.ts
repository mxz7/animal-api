import db from "$lib/server/database/database";
import { imageReports, images } from "$lib/server/database/schema";
import { desc, eq } from "drizzle-orm";

export async function load() {
  const reports = await db
    .select({
      id: imageReports.id,
      report: imageReports.content,
      ip: imageReports.createdIp,
      type: images.type,
      imageId: images.id,
      imageName: images.name,
      date: imageReports.createdAt,
    })
    .from(imageReports)
    .orderBy(desc(imageReports.createdAt))
    .leftJoin(images, eq(images.id, imageReports.imageId));

  return { reports };
}

export const actions = {
  delete: async ({ request }) => {
    const data = await request.formData();

    await db.delete(imageReports).where(eq(imageReports.id, data.get("id")?.toString()!));
  },
};
