async function getApiMessage(): Promise<string> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/greeting`, {

      cache: 'no-store'
    });
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error("Failed to fetch API data:", error);
    return "Could not connect to the API. Is it running?";
  }
}

export default async function HomePage() {

  const apiMessage = await getApiMessage();

  return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>Connecting Laravel and Next.js</h1>
        <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0', border: '1px solid #ddd' }}>
          <p>Message received from the API:</p>
          <h2>{apiMessage}</h2>
        </div>
      </div>
  );
}