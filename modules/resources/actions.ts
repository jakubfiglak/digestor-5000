'use server';

export async function submitResourceAction(data: FormData) {
  console.log({
    title: data.get('title'),
    type: data.get('type'),
    url: data.get('url'),
  });
}
