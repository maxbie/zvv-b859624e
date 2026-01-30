import { useQuery } from "@tanstack/react-query";

interface Stop {
  departure: string;
  delay: number | null;
  platform: string | null;
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
    station: "Killwangen-Spreitenbach",
    limit: "15",
  });

  const response = await fetch(
    `https://transport.opendata.ch/v1/stationboard?${params}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stationboard");
  }

  const data: StationboardResponse = await response.json();

  // Take first 5 departures (all go towards Zürich from this station)
  return data.stationboard.slice(0, 5);
};

export const useStationboard = () => {
  return useQuery({
    queryKey: ["stationboard", "killwangen-spreitenbach"],
    queryFn: fetchStationboard,
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

export const calculateMinutesUntilDeparture = (departureTime: string, delay: number | null): number => {
  const departure = new Date(departureTime);
  const now = new Date();
  
  if (delay) {
    departure.setMinutes(departure.getMinutes() + delay);
  }
  
  const diffMs = departure.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  return Math.max(0, diffMinutes);
};
