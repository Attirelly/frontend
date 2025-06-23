export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

type GAEventParams = {
  [key: string | number]: any;
};

export const event = ({
  action,
  params,
}: {
  action: string;
  params: GAEventParams;
}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  }
};