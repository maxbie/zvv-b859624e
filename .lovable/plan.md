
# Vollständige Implementierung: Nose Transport Font + Zweigeteilte Anzeige

Umfassende Neugestaltung der Abfahrtsanzeige mit authentischer VBZ-Font und zweigeteiltem Layout.

---

## Neue Font: Nose Transport

Die Nose Transport Font ist eine Open-Source-Schriftfamilie, die speziell für Schweizer ÖV-Anzeigen entwickelt wurde. Sie simuliert echte Dot-Matrix-Displays.

### Font-Varianten
- **Nose Transport 16**: Grösste Variante (16px Höhe bei Grossbuchstaben)
- **Nose Transport 13**: Mittlere Variante
- **Nose Transport 09**: Kleinste Variante
- Verfügbar in 4 Gewichten: Light, Regular, Medium, Bold
- Zwei Pixel-Formen: Rund und Quadratisch

### Integration
1. WOFF-Dateien aus dem Release herunterladen
2. Im `public/fonts/` Ordner ablegen
3. `@font-face` in CSS definieren
4. `.font-led` Klasse auf neue Font umstellen

---

## Neues Layout

```text
┌───────────────────────────────────────────────────────────┐
│                                    31.1.2026    14:35     │
├───────────────────────────────────────────────────────────┤
│  Fellenbergstrasse                                        │
│  ─────────────────────────────────────────────            │
│  3   Zürich, Klusplatz                               4'   │
│  3   Zürich, Klusplatz                               8'   │
│  3   Zürich, Klusplatz                              12'   │
├───────────────────────────────────────────────────────────┤
│  Albisriederdörfli                                        │
│  ─────────────────────────────────────────────            │
│  80  Zürich Oerlikon, Bahnhof                        2'   │
│  80  Zürich Oerlikon, Bahnhof                       14'   │
│  80  Zürich Oerlikon, Bahnhof                   [Bus]     │
└───────────────────────────────────────────────────────────┘
```

---

## Änderungen im Detail

### 1. Neue Dateien

**public/fonts/** (Ordner erstellen)
- `NoseTransport16-Regular.woff`
- `NoseTransport16-Bold.woff`
- Aus dem GitHub Release extrahieren

### 2. src/index.css

- `@font-face` Deklaration für Nose Transport hinzufügen
- Google Fonts Import entfernen
- `.font-led` auf Nose Transport umstellen

```css
@font-face {
  font-family: 'Nose Transport';
  src: url('/fonts/NoseTransport16-Regular.woff') format('woff');
  font-weight: 400;
}

@font-face {
  font-family: 'Nose Transport';
  src: url('/fonts/NoseTransport16-Bold.woff') format('woff');
  font-weight: 700;
}

.font-led {
  font-family: 'Nose Transport', monospace;
}
```

### 3. src/hooks/useStationboard.ts

Kompletter Umbau mit zwei separaten Hooks:

```typescript
// Generische Fetch-Funktion
const fetchStationboardFiltered = async (
  station: string,
  filterNumber: string,
  filterDirection: string,
  limit: number
): Promise<Connection[]> => { ... }

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
```

### 4. src/components/DepartureDisplay.tsx

Kompletter Umbau:

**Neue Komponenten:**
- `StationSection`: Zeigt Stationsname + 3 Abfahrten
- `DepartureRow`: Vereinfacht (Linie, Ziel, Minuten/Icon)
- `DateTimeDisplay`: Datum und Uhrzeit oben rechts

**Besonderheiten:**
- Bei `minutes === 0`: Tram- oder Bus-Icon anzeigen (aus lucide-react)
- Datum/Uhrzeit im Format `31.1.2026    14:35`
- Keine Gleis-/Kante-Informationen
- Ziel direkt aus API (`departure.to`)

**Layout:**
- Flexbox mit zwei gleich grossen Hälften (50% / 50%)
- Absolute Positionierung für Datum/Uhrzeit oben rechts
- Viewport-basierte Schriftgrössen für Responsiveness

### 5. Lucide Icons

Import und Verwendung:
```tsx
import { Tram, Bus } from 'lucide-react';

// Bei minutes === 0:
{minutes === 0 ? (
  category === "Tram" ? <Tram /> : <Bus />
) : (
  <span>{minutes}'</span>
)}
```

---

## Technische Details

### API-Aufrufe
- Zwei parallele Queries (Fellenbergstrasse + Albisriederdörfli)
- Clientseitige Filterung nach Linie und Richtung
- 30s Auto-Refresh für beide unabhängig

### Datumsformatierung
```typescript
const formatDateTime = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("de-CH", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${day}.${month}.${year}    ${time}`;
};
```

### Fehlerbehandlung
- Jede Station hat eigenen Loading/Error-State
- Fallback-Anzeige wenn keine Daten

---

## Zusammenfassung der Dateien

| Datei | Aktion |
|-------|--------|
| `public/fonts/NoseTransport16-Regular.woff` | Neu erstellen (Download) |
| `public/fonts/NoseTransport16-Bold.woff` | Neu erstellen (Download) |
| `src/index.css` | Anpassen (@font-face, .font-led) |
| `src/hooks/useStationboard.ts` | Komplett umbauen (2 Hooks) |
| `src/components/DepartureDisplay.tsx` | Komplett umbauen (2 Sektionen) |
