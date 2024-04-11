import { error } from "@sveltejs/kit";

export async function load({ fetch, params, data }) {
  const image = await fetch(`/api/${params.type}/${params.id}`);

  if (!image.ok) return error(image.status, { message: image.statusText });

  const imageData: {
    id: string;
    name: string;
    type: string;
    likes: number;
    reports: number;
    createdAt: number;
  } = await image.json();

  return { image: imageData, reportForm: data.reportForm };
}
