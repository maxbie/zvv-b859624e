import { useFellenbergstrasse, useAlbisriederDoerfli, calculateMinutesUntilDeparture } from "@/hooks/useStationboard";
import { useEffect, useState } from "react";

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
  return `${day}.${month}.${year}    ${time}`;
};

const DateTimeDisplay = ({ currentTime }: { currentTime: Date }) => (
  <div className="absolute top-[2vh] right-[2vw] text-led-amber-dim font-led text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] whitespace-nowrap">
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
  <div className="flex items-center justify-between w-full px-[2vw] py-[1vh]">
    <div className="flex items-center gap-[2vw]">
      <span className="text-led-amber font-led text-[5vw] md:text-[4vw] lg:text-[3vw] font-bold min-w-[8vw]">
        {lineNumber}
      </span>
      <span className="text-led-amber font-led text-[3.5vw] md:text-[3vw] lg:text-[2.5vw]">
        {destination.replace(/, Bahnhof Nord$/, "")}
      </span>
    </div>
    <div className="text-led-amber font-led text-[5vw] md:text-[4vw] lg:text-[3vw] font-bold min-w-[8vw] text-right">
      {minutes === 0 ? <span>☺</span> : <span>{minutes}'</span>}
    </div>
  </div>
);

const StationSection = ({
  stationName,
  departures,
  isLoading,
  isError,
}: {
  stationName: string;
  departures: Connection[] | undefined;
  isLoading: boolean;
  isError: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col px-[2vw] py-[2vh]">
        <h2 className="text-led-amber font-led text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] mb-[1vh]">
          {stationName}
        </h2>
        <div className="border-b border-amber-900/30 mb-[1vh]" />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-led-amber font-led text-[3vw] animate-pulse">
            Lade Daten...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col px-[2vw] py-[2vh]">
        <h2 className="text-led-amber font-led text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] mb-[1vh]">
          {stationName}
        </h2>
        <div className="border-b border-amber-900/30 mb-[1vh]" />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-led-amber-dim font-led text-[2.5vw]">
            Verbindung fehlgeschlagen
          </span>
        </div>
      </div>
    );
  }

  if (!departures || departures.length === 0) {
    return (
      <div className="flex-1 flex flex-col px-[2vw] py-[2vh]">
        <h2 className="text-led-amber font-led text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] mb-[1vh]">
          {stationName}
        </h2>
        <div className="border-b border-amber-900/30 mb-[1vh]" />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-led-amber-dim font-led text-[2.5vw]">
            Keine Abfahrten
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-[2vw] py-[2vh]">
      <h2 className="text-led-amber font-led text-[3.5vw] md:text-[3vw] lg:text-[2.5vw] mb-[1vh]">
        {stationName}
      </h2>
      <div className="border-b border-amber-900/30 mb-[1vh]" />
      <div className="flex flex-col justify-start">
        {departures.map((departure, index) => {
          const minutes = calculateMinutesUntilDeparture(
            departure.stop.departure,
            departure.stop.delay
          );

          return (
            <DepartureRow
              key={`${departure.stop.departure}-${index}`}
              lineNumber={departure.number}
              destination={departure.to}
              minutes={minutes}
            />
          );
        })}
      </div>
    </div>
  );
};

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

  return (
    <div className="relative flex flex-col w-full h-full">
      {/* Date/Time Display */}
      <DateTimeDisplay currentTime={currentTime} />

      {/* Fellenbergstrasse Section */}
      <StationSection
        stationName="Fellenbergstrasse"
        departures={fellenbergstrasse.data}
        isLoading={fellenbergstrasse.isLoading}
        isError={fellenbergstrasse.isError}
      />

      {/* Divider */}
      <div className="border-t border-amber-900/50 mx-[2vw]" />

      {/* Albisriederdörfli Section */}
      <StationSection
        stationName="Albisriederdörfli"
        departures={albisriederDoerfli.data}
        isLoading={albisriederDoerfli.isLoading}
        isError={albisriederDoerfli.isError}
      />
    </div>
  );
};
