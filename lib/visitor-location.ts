export type VisitorLocation = {
  city: string;
  region?: string;
  country: string;
  label: string;
};

function formatVisitorLabel(city: string) {
  return city.toLowerCase();
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? null;
  }

  return request.headers.get('x-real-ip');
}

async function getLocationFromIp(ip: string | null): Promise<VisitorLocation | null> {
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return {
      city: 'San Francisco',
      region: 'CA',
      country: 'US',
      label: 'san francisco',
    };
  }

  try {
    const response = await fetch(`https://ipwho.is/${ip}`, {
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      success?: boolean;
      city?: string;
      region_code?: string;
      country_code?: string;
    };

    if (!data.success || !data.city || !data.country_code) {
      return null;
    }

    return {
      city: data.city,
      region: data.region_code,
      country: data.country_code,
      label: formatVisitorLabel(data.city),
    };
  } catch {
    return null;
  }
}

export async function getLocationFromRequest(request: Request): Promise<VisitorLocation | null> {
  const city = request.headers.get('x-vercel-ip-city');
  const region = request.headers.get('x-vercel-ip-country-region');
  const country = request.headers.get('x-vercel-ip-country');

  if (city && country) {
    return {
      city,
      region: region ?? undefined,
      country,
      label: formatVisitorLabel(city),
    };
  }

  return getLocationFromIp(getClientIp(request));
}
