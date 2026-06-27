export async function hashDocument (file: File): Promise<string> {
  const buffer  = await file.arrayBuffer()
  const hashBuf = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(hashBuf))
    .map((b: number) => b.toString(16).padStart(2, '0'))
    .join('')
}