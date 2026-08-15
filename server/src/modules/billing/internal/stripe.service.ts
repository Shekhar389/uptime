export async function createStripeCheckout(teamId: string, plan: string): Promise<string> {
  return `https://checkout.stripe.com/mock-session?team=${teamId}&plan=${plan}`;
}
