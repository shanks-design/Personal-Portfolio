'use client';

import { useEffect, useState } from 'react';

function isSfDaytime(date = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Los_Angeles',
      hour: '2-digit',
      hour12: false,
    }).format(date)
  );
  return hour >= 6 && hour < 20;
}

function SunIcon({ size }: { size: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <g clipPath="url(#sf-sun-clip)">
        <path
          d="M9.99984 13.3332C11.8408 13.3332 13.3332 11.8408 13.3332 9.99984C13.3332 8.15889 11.8408 6.6665 9.99984 6.6665C8.15889 6.6665 6.6665 8.15889 6.6665 9.99984C6.6665 11.8408 8.15889 13.3332 9.99984 13.3332Z"
          stroke="#A2A2A2"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10 1.6665V3.33317" stroke="#A2A2A2"  strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 16.6665V18.3332" stroke="#A2A2A2"  strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.1084 4.1084L5.2834 5.2834" stroke="#A2A2A2"  strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.7168 14.7168L15.8918 15.8918" stroke="#A2A2A2"  strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.6665 10H3.33317" stroke="#A2A2A2"  strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.6665 10H18.3332" stroke="#A2A2A2"  strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.2834 14.7168L4.1084 15.8918" stroke="#A2A2A2"  strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.8918 4.1084L14.7168 5.2834" stroke="#A2A2A2"  strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="sf-sun-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function MoonIcon({ size }: { size: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M17.4999 10.6583C17.3688 12.0768 16.8365 13.4287 15.9651 14.5557C15.0938 15.6826 13.9195 16.5382 12.5797 17.0221C11.2398 17.5061 9.7899 17.5984 8.3995 17.2884C7.0091 16.9784 5.73575 16.2788 4.72844 15.2715C3.72113 14.2642 3.02153 12.9908 2.71151 11.6004C2.40148 10.21 2.49385 8.76007 2.9778 7.42025C3.46175 6.08042 4.31728 4.90614 5.44426 4.03479C6.57125 3.16345 7.92308 2.63109 9.34158 2.5C8.5111 3.62356 8.11146 5.00787 8.21536 6.40118C8.31926 7.79448 8.9198 9.10422 9.90775 10.0922C10.8957 11.0801 12.2054 11.6807 13.5987 11.7846C14.992 11.8885 16.3764 11.4888 17.4999 10.6583Z"
        stroke="#A2A2A2"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon({
  daytime,
  iconSize,
}: {
  daytime: boolean | null;
  iconSize: number | string;
}) {
  if (daytime === null) {
    return (
      <span
        className="inline-block shrink-0"
        style={{ width: iconSize, height: iconSize }}
        aria-hidden
      />
    );
  }

  return daytime ? <SunIcon size={iconSize} /> : <MoonIcon size={iconSize} />;
}

export default function SfLocation({
  className,
  iconSize = 20,
  variant = 'stacked',
}: {
  className?: string;
  iconSize?: number | string;
  variant?: 'stacked' | 'inline';
}) {
  const [daytime, setDaytime] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setDaytime(isSfDaytime());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (variant === 'inline') {
    return (
      <p className={className}>
        <span className="inline-flex items-center gap-[6px]">
          <LocationIcon daytime={daytime} iconSize={iconSize} />
          San Francisco
        </span>
      </p>
    );
  }

  return (
    <p className={className}>
      based in
      <br />
      <span className="inline-flex items-center gap-[6px]">
        San Francisco
        <LocationIcon daytime={daytime} iconSize={iconSize} />
      </span>
    </p>
  );
}
