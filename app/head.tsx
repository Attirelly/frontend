// app/head.tsx
export default function Head() {
  return (
    <>
      <title>Attirelly</title>
      {/* Shopify CDN optimization */}
      <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://cdn.shopify.com" />
    </>
  )
}
