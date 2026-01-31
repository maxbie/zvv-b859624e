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

const fetchStationboardFiltered = async (
  station: string,
  filterNumber: string,
  filterDirection: string,
  limit: number
): Promise<Connection[]> => {
  const params = new URLSearchParams({
    station: station,
    limit: "20", // Fetch more to filter
  });

  const response = await fetch(
    `https://transport.opendata.ch/v1/stationboard?${params}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stationboard");
  }

  const data: StationboardResponse = await response.json();

  // Filter by line number and direction
  const filtered = data.stationboard.filter((connection) => {
    const matchesNumber = connection.number === filterNumber;
    const matchesDirection = connection.to.toLowerCase().includes(filterDirection.toLowerCase());
    return matchesNumber && matchesDirection;
  });

  return filtered.slice(0, limit);
};

// Hook für Fellenbergstrasse (Tram 3 -> Klusplatz)
export const useFellenbergstrasse = () => {
  return useQuery({
    queryKey: ["stationboard", "fellenbergstrasse", "3", "klusplatz"],
    queryFn: () => fetchStationboardFiltered(
      "Zürich, Fellenbergstrasse",
      "3",
      "Klusplatz",
      3
    ),
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

// Hook für Albisriederdörfli (Bus 80 -> Oerlikon)
export const useAlbisriederDoerfli = () => {
  return useQuery({
    queryKey: ["stationboard", "albisriederDoerfli", "80", "oerlikon"],
    queryFn: () => fetchStationboardFiltered(
      "Zürich, Albisriederdörfli",
      "80",
      "Oerlikon",
      3
    ),
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
