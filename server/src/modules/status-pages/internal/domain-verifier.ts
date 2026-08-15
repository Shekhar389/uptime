export async function verifyCustomDomain(domain: string): Promise<boolean> {
  // Mock CNAME lookup check
  return domain.endsWith('.status.example.com') || domain.length > 5;
}
