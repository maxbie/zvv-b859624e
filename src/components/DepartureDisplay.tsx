import { useStationboard, calculateMinutesUntilDeparture } from "@/hooks/useStationboard";
import { useEffect, useState } from "react";

const DepartureRow = ({
  lineNumber,
  destination,
  minutes,
}: {
  lineNumber: string;
  destination: string;
  minutes: number;
}) => {
  return (
    <div className="flex items-center justify-between w-full px-[2vw] py-[1vh]">
      <div className="flex items-center gap-[2vw]">
        <span className="text-led-amber font-led text-[6vw] md:text-[5vw] lg:text-[4vw] font-bold min-w-[8vw]">
          {lineNumber}
        </span>
        <span className="text-led-amber font-led text-[5vw] md:text-[4vw] lg:text-[3.5vw]">
          {destination}
        </span>
      </div>
      <span className="text-led-amber font-led text-[6vw] md:text-[5vw] lg:text-[4vw] font-bold">
        {minutes}'
      </span>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex items-center justify-center h-full">
    <span className="text-led-amber font-led text-[4vw] animate-pulse">
      Lade Daten...
    </span>
  </div>
);

const ErrorState = () => (
  <div className="flex items-center justify-center h-full">
    <span className="text-led-amber-dim font-led text-[3vw]">
      Verbindung fehlgeschlagen
    </span>
  </div>
);

const NoDataState = () => (
  <div className="flex items-center justify-center h-full">
    <span className="text-led-amber-dim font-led text-[3vw]">
      Keine Abfahrten
    </span>
  </div>
);

export const DepartureDisplay = () => {
  const { data: departures, isLoading, isError } = useStationboard();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every 10 seconds to recalculate minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!departures || departures.length === 0) return <NoDataState />;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="px-[2vw] py-[2vh] border-b border-amber-900/30">
        <h1 className="text-led-amber font-led text-[4vw] md:text-[3vw] lg:text-[2.5vw]">
          Fellenbergstrasse
        </h1>
        <p className="text-led-amber-dim font-led text-[2vw] md:text-[1.5vw] lg:text-[1vw] mt-[0.5vh]">
          {currentTime.toLocaleTimeString("de-CH", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Departures List */}
      <div className="flex-1 flex flex-col justify-start pt-[2vh]">
        {departures.map((departure, index) => {
          const minutes = calculateMinutesUntilDeparture(
            departure.stop.departure,
            departure.stop.delay
          );

          return (
            <DepartureRow
              key={`${departure.stop.departure}-${index}`}
              lineNumber={departure.number}
              destination="Klusplatz"
              minutes={minutes}
            />
          );
        })}
      </div>

      {/* Footer with update indicator */}
      <div className="px-[2vw] py-[1vh] border-t border-amber-900/30">
        <p className="text-led-amber-dim font-led text-[1.5vw] md:text-[1vw] lg:text-[0.8vw]">
          Auto-Update alle 30s
        </p>
      </div>
    </div>
  );
};
