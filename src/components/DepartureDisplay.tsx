import { useFellenbergstrasse, useAlbisriederDoerfli, calculateMinutesUntilDeparture } from "@/hooks/useStationboard";
import { useEffect, useState, useMemo } from "react";

interface Connection {
  stop: {
    departure: string;
    delay: number | null;
    platform: string | null;
  };
  name: string;
  category: string;
  number: string;
  to: string;
}

const formatDateTime = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("de-CH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day}.${month}.${year}   ${time}`;
};

const RefreshInfo = () => (
  <div className="absolute top-[2vh] left-[2vw] text-led-amber-dim font-led text-[5vw] md:text-[4vw] lg:text-[3vw] whitespace-nowrap">
    Aktualisierung alle 30s
  </div>
);

const DateTimeDisplay = ({ currentTime }: { currentTime: Date }) => (
  <div className="absolute top-[2vh] right-[2vw] text-led-amber-dim font-led text-[5vw] md:text-[4vw] lg:text-[3vw] whitespace-nowrap">
    {formatDateTime(currentTime)}
  </div>
);

const DepartureRow = ({
  lineNumber,
  destination,
  minutes,
}: {
  lineNumber: string;
  destination: string;
  minutes: number;
}) => (
  <div className="flex items-center justify-between w-full px-[2vw]">
    <div className="flex items-center gap-[2vw]">
      <span className="text-led-amber font-led text-[10vw] md:text-[8vw] lg:text-[6vw] font-bold min-w-[12vw]">
        {lineNumber}
      </span>
      <span className="text-led-amber font-led text-[7vw] md:text-[6vw] lg:text-[5vw]">
        {destination.replace(/ Nord$/, "")}
      </span>
    </div>
    <span className="text-led-amber font-led text-[10vw] md:text-[8vw] lg:text-[6vw] font-bold min-w-[12vw] text-right">
      {minutes === 0 ? "☺" : `${minutes}'`}
    </span>
  </div>
);

export const DepartureDisplay = () => {
  const fellenbergstrasse = useFellenbergstrasse();
  const albisriederDoerfli = useAlbisriederDoerfli();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every 10 seconds to recalculate minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Combine and sort all departures by minutes until departure
  const allDepartures = useMemo(() => {
    const departures: Array<Connection & { minutes: number }> = [];

    if (fellenbergstrasse.data) {
      fellenbergstrasse.data.forEach((dep) => {
        departures.push({
          ...dep,
          minutes: calculateMinutesUntilDeparture(dep.stop.departure, dep.stop.delay),
        });
      });
    }

    if (albisriederDoerfli.data) {
      albisriederDoerfli.data.forEach((dep) => {
        departures.push({
          ...dep,
          minutes: calculateMinutesUntilDeparture(dep.stop.departure, dep.stop.delay),
        });
      });
    }

    return departures.sort((a, b) => a.minutes - b.minutes);
  }, [fellenbergstrasse.data, albisriederDoerfli.data, currentTime]);

  const isLoading = fellenbergstrasse.isLoading || albisriederDoerfli.isLoading;
  const isError = fellenbergstrasse.isError && albisriederDoerfli.isError;

  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden">
      {/* Refresh Info */}
      <RefreshInfo />

      {/* Date/Time Display */}
      <DateTimeDisplay currentTime={currentTime} />

      {/* Departures List */}
      <div className="flex-1 flex flex-col px-[2vw] py-[8vh]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-led-amber font-led text-[6vw] animate-pulse">
              Lade Daten...
            </span>
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-led-amber-dim font-led text-[5vw]">
              Verbindung fehlgeschlagen
            </span>
          </div>
        ) : allDepartures.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-led-amber-dim font-led text-[5vw]">
              Keine Abfahrten
            </span>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-[64%]">
            {allDepartures.slice(0, 5).map((departure, index) => (
              <DepartureRow
                key={`${departure.stop.departure}-${index}`}
                lineNumber={departure.number}
                destination={departure.to}
                minutes={departure.minutes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
