// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const url = searchParams.get('url');
//   if (!url) {
//     return new Response('Missing url', { status: 400 });
//   }

//   try {
//     const imageResp = await fetch(url);
//     if (!imageResp.ok) {
//       return new Response('Failed to fetch image', { status: 502 });
//     }

//     const contentType = imageResp.headers.get('content-type') || 'image/jpeg';
//     const imgBuffer = Buffer.from(await imageResp.arrayBuffer());

//     return new Response(imgBuffer, {
//       status: 200,
//       headers: {
//         'Content-Type': contentType,
//         'Cache-Control': 'public, max-age=86400',
//       },
//     });
//   } catch (e) {
//     return new Response('Failed to fetch image', { status: 500 });
//   }
// }


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  if (!url) {
    return new Response('Missing url', { status: 400 });
  }

  try {
    const imageResp = await fetch(url);
    if (!imageResp.ok) {
      return new Response('Failed to fetch image', { status: imageResp.status });
    }

    const contentType = imageResp.headers.get('content-type') || 'image/jpeg';
    
    // Instead of buffering, use the response body directly as a readable stream
    return new Response(imageResp.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  } catch (e) {
    return new Response('Failed to fetch image', { status: 500 });
  }
}