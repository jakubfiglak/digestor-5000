export async function getBufferFromRemoteFile(url: string) {
  const response = await fetch(url);

  if (response.ok) {
    const data = await response.arrayBuffer();
    return Buffer.from(data);
  }

  return null;
}
