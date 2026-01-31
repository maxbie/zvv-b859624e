
# Drei Anpassungen für die Abfahrtsanzeige

---

## Änderung 1: 3 Leerschläge zwischen Datum und Uhrzeit

### Aktuell (Zeile 24)
```tsx
return `${day}.${month}.${year}    ${time}`;
```
Das sind aktuell 4 Leerzeichen.

### Neu
```tsx
return `${day}.${month}.${year}   ${time}`;
```
Genau 3 Leerzeichen zwischen Datum und Uhrzeit.

---

## Änderung 2: Dynamischer Zeilenabstand für 4:3-Format

### Aktuell (Zeile 42)
```tsx
<div className="flex items-center justify-between w-full px-[2vw] py-[1vh]">
```
Fester Zeilenabstand von `1vh`.

### Neu
Für ein 4:3-Format mit 5 Einträgen nutzen wir `justify-between` auf dem Container, damit die Zeilen gleichmässig über die verfügbare Höhe verteilt werden:

```tsx
// Container (Zeile 125)
<div className="flex flex-col justify-between h-full">

// DepartureRow (Zeile 42)
<div className="flex items-center justify-between w-full px-[2vw]">
```

So wird der vertikale Abstand automatisch berechnet und die 5 Zeilen füllen den verfügbaren Platz optimal aus.

---

## Änderung 3: Nur 5 Einträge anzeigen

### Aktuell (Zeile 126)
```tsx
{allDepartures.map((departure, index) => (
```
Zeigt alle Abfahrten an (bis zu 6).

### Neu
```tsx
{allDepartures.slice(0, 5).map((departure, index) => (
```
Begrenzt auf die ersten 5 Einträge.

---

## Zusammenfassung der Code-Änderungen

| Zeile | Was | Änderung |
|-------|-----|----------|
| 24 | formatDateTime | 4 → 3 Leerzeichen |
| 42 | DepartureRow | `py-[1vh]` entfernen |
| 125 | Container | `justify-between h-full` hinzufügen |
| 126 | map | `.slice(0, 5)` hinzufügen |
