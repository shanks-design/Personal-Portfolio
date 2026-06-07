import { getLocationFromRequest } from '@/lib/visitor-location';
import { getLastVisitor, setLastVisitor } from '@/lib/visitor-store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const previous = await getLastVisitor();
  const current = await getLocationFromRequest(request);

  if (current) {
    await setLastVisitor({
      label: current.label,
      city: current.city,
      region: current.region,
      country: current.country,
      visitedAt: new Date().toISOString(),
    });
  }

  return Response.json({
    lastVisitor: previous?.label ?? null,
  });
}
