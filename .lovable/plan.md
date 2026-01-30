
# Tram-Abfahrtsanzeige Fellenbergstrasse

Eine Fullscreen-Abfahrtsanzeige im Stil einer echten Haltestellen-Anzeige, die die nächsten 5 Abfahrten der Tramlinie 3 in Richtung Klusplatz anzeigt.

---

## Design & Layout

- **Fullscreen-Darstellung** mit schwarzem Hintergrund
- **Gelbe/Amber LED-Schrift** wie bei echten VBZ-Anzeigen
- **Skalierbare Fonts** (viewport-basierte Größen), die sich automatisch an die Bildschirmgröße anpassen
- **Monospace/Digital-Font** für authentischen Look

---

## Angezeigte Informationen pro Zeile

- **Liniennummer** (3)
- **Ziel** (Klusplatz)
- **Minuten bis Abfahrt** (z.B. 4', 12', 18')

---

## Datenquelle & Logik

- **API**: transport.opendata.ch `/stationboard` Endpoint
- **Station**: Fellenbergstrasse
- **Filter**: Nur Tram (transportations=tram), nur Richtung Klusplatz
- **Limit**: 5 nächste Abfahrten
- **Echtzeit-Berechnung**: Minuten bis Abfahrt basierend auf aktueller Zeit

---

## Automatische Aktualisierung

- **Live-Refresh** alle 30 Sekunden
- **Sanfte Übergänge** bei Datenaktualisierung
- **Zeitanzeige** immer aktuell (Minuten werden laufend neu berechnet)

---

## Technische Umsetzung

- Direkter API-Aufruf aus dem Frontend (die API unterstützt CORS)
- React Query für effizientes Daten-Caching und automatisches Refetching
- Keine Backend-Infrastruktur erforderlich
