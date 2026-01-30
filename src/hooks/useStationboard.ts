import { useQuery } from "@tanstack/react-query";

interface Stop {
  departure: string;
  delay: number | null;
}

interface Connection {
  stop: Stop;
  name: string;
  category: string;
  number: string;
  to: string;
}

interface StationboardResponse {
  station: {
    id: string;
    name: string;
  };
  stationboard: Connection[];
}

const fetchStationboard = async (): Promise<Connection[]> => {
  const params = new URLSearchParams({
    station: "Fellenbergstrasse",
    limit: "15", // Fetch more to filter
    transportations: "tram",
  });

  const response = await fetch(
    `https://transport.opendata.ch/v1/stationboard?${params}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stationboard");
  }

  const data: StationboardResponse = await response.json();

  // Filter for line 3 going to Klusplatz and take first 5
  const filtered = data.stationboard
    .filter(
      (connection) =>
        connection.number === "3" &&
        connection.to.toLowerCase().includes("klusplatz")
    )
    .slice(0, 5);

  return filtered;
};

export const useStationboard = () => {
  return useQuery({
    queryKey: ["stationboard", "fellenbergstrasse"],
    queryFn: fetchStationboard,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

export const calculateMinutesUntilDeparture = (departureTime: string, delay: number | null): number => {
  const departure = new Date(departureTime);
  const now = new Date();
  
  // Add delay if present
  if (delay) {
    departure.setMinutes(departure.getMinutes() + delay);
  }
  
  const diffMs = departure.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  return Math.max(0, diffMinutes);
};
