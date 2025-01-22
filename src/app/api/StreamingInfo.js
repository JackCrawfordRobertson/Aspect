import { useEffect, useState } from "react";

const StreamingInfo = ({ movieId }) => {
  const [streamingData, setStreamingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRegion, setUserRegion] = useState("");

  useEffect(() => {
    const userLocale = navigator.language || navigator.languages[0];
    const region = userLocale.split("-")[1]; // Extract country code
    console.log("Detected user region:", region);
    setUserRegion(region || "US"); // Fallback to "US" if region is not detected
  }, []);

  useEffect(() => {
    const fetchStreamingData = async () => {
      if (!movieId) {
        console.log("No movieId provided.");
        return;
      }

      console.log("Fetching streaming data for movieId:", movieId);

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://streaming-availability.p.rapidapi.com/shows/movie/${movieId}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
              "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
            },
          }
        );

        console.log("API Response Status:", response.status);

        if (!response.ok) {
          console.error("Response not OK:", response.status, response.statusText);
          throw new Error("Failed to fetch streaming information.");
        }

        const data = await response.json();
        console.log("Fetched streaming data:", data);

        setStreamingData(data.streamingOptions || {});
      } catch (err) {
        console.error("Error fetching streaming data:", err);
        setError("Unable to load streaming information.");
      } finally {
        setLoading(false);
      }
    };

    fetchStreamingData();
  }, [movieId]);

  if (loading) {
    return <p className="text-foreground/80 dark:text-white">Loading streaming information...</p>;
  }

  if (error) {
    return <p className="text-foreground/80 dark:text-white">{error}</p>;
  }

  if (!streamingData || Object.keys(streamingData).length === 0) {
    console.log("Streaming data is empty or undefined:", streamingData);
    return <p className="text-foreground/80 dark:text-white">No streaming information available.</p>;
  }

  const filteredServices = (streamingData[userRegion] || []).slice(0, 5);
  const fallbackServices = Object.entries(streamingData)
    .filter(([region]) => region !== userRegion)
    .flatMap(([region, services]) =>
      services.map((service) => ({ ...service, region }))
    )
    .slice(0, 5);

  const uniqueFallbackServices = Array.from(
    new Map(
      fallbackServices.map((service) => [
        `${service.service.name}-${service.region}`,
        service,
      ])
    ).values()
  );

  return (
    <div>
      <h3 className="text-2xl font-bold text-foreground/80 dark:text-white">
        Available On:
      </h3>
      <ul className="mt-2 text-sm text-foreground/80 dark:text-white">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <li key={`${service.service.id}-${index}`}>
              <a
                href={service.service.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 dark:text-white hover:underline"
              >
                {service.service.name}
              </a>
            </li>
          ))
        ) : uniqueFallbackServices.length > 0 ? (
          <>
            <p className="text-foreground/80 dark:text-white">
              <b>No services available in your region.</b>
              <br />
              Showing options from other regions:
            </p>
            {uniqueFallbackServices.map((service, index) => (
              <li key={`${service.service.name}-${service.region}-${index}`}>
                <a
                  href={service.service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 dark:text-white hover:underline" 
                >
                  {service.service.name} <strong>{service.region.toUpperCase()}</strong>
                </a>
              </li>
            ))}
          </>
        ) : (
          <p className="text-foreground/80 dark:text-white">No streaming information available in any region.</p>
        )}
      </ul>
    </div>
  );
};

export default StreamingInfo;