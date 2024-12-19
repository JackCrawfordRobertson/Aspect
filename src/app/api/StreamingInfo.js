import { useEffect, useState } from 'react';

const StreamingInfo = ({ movieId }) => {
  const [streamingData, setStreamingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRegion, setUserRegion] = useState('');

  useEffect(() => {
    // Get user region from the browser's locale or use a geo-location API
    const userLocale = navigator.language || navigator.languages[0];
    const region = userLocale.split('-')[1]; // This gives you the country code (e.g., 'US')
    setUserRegion(region);
  }, []);

  useEffect(() => {
    const fetchStreamingData = async () => {
      if (!movieId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://streaming-availability.p.rapidapi.com/shows/movie/${movieId}`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
              'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch streaming information.');
        }

        const data = await response.json();
        setStreamingData(data.streamingOptions || null);
      } catch (err) {
        console.error('Error fetching streaming data:', err);
        setError('Unable to load streaming information.');
      } finally {
        setLoading(false);
      }
    };

    // Throttle the API request to prevent rapid-fire calls
    const timeout = setTimeout(() => {
      fetchStreamingData();
    }, 500);

    return () => clearTimeout(timeout);
  }, [movieId]);

  if (loading) {
    return <p>Loading streaming information...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!streamingData || Object.keys(streamingData).length === 0) {
    return <p>No streaming information available.</p>;
  }

  // Filter streaming services by the user's region
  const filteredServices = streamingData[userRegion] || [];

  return (
    <div>
      <h3 className="text-2xl font-bold text-white dark:text-white">
        Available On:
      </h3>
      <ul className="mt-2 text-sm text-white">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <li key={service.service.id}>
              <a
                href={service.service.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                {service.service.name}
              </a>
            </li>
          ))
        ) : (
          <p>No services available in your region.</p>
        )}
      </ul>
    </div>
  );
};

export default StreamingInfo;