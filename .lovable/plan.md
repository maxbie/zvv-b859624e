

# Gemischte Liste, korrigiertes Ziel und grössere Schriften

Drei Anpassungen für die Abfahrtsanzeige.

---

## Änderung 1: Alle Abfahrten durchmischt anzeigen

### Aktuell
- Zwei separate `StationSection`-Blöcke mit Überschriften
- Trennlinie zwischen den Stationen

### Neu
- Eine einzige Liste mit allen 6 Abfahrten
- Sortiert nach Minuten bis zur Abfahrt
- Keine Stationsüberschriften mehr

**Umsetzung:**
- `StationSection` Komponente entfernen
- Neue Logik: beide Datenquellen kombinieren, Minuten berechnen, nach Zeit sortieren
- `useMemo` für Performance-Optimierung

---

## Änderung 2: "Zürich Oerlikon, Bahnhof" statt "Zürich Oerlikon"

### Aktuell (Zeile 48)
```tsx
{destination.replace(/, Bahnhof Nord$/, "")}
```
Dies entfernt ", Bahnhof Nord" komplett → Ergebnis: "Zürich Oerlikon"

### Neu
```tsx
{destination.replace(/ Nord$/, "")}
```
Dies entfernt nur " Nord" am Ende → Ergebnis: "Zürich Oerlikon, Bahnhof"

---

## Änderung 3: Alle Schriftgrössen verdoppeln

### Aktuelle Grössen → Neue Grössen

| Element | Aktuell | Neu (×2) |
|---------|---------|----------|
| Datum/Zeit | `text-[2.5vw] md:text-[2vw] lg:text-[1.5vw]` | `text-[5vw] md:text-[4vw] lg:text-[3vw]` |
| Liniennummer | `text-[5vw] md:text-[4vw] lg:text-[3vw]` | `text-[10vw] md:text-[8vw] lg:text-[6vw]` |
| Ziel | `text-[3.5vw] md:text-[3vw] lg:text-[2.5vw]` | `text-[7vw] md:text-[6vw] lg:text-[5vw]` |
| Minuten | `text-[5vw] md:text-[4vw] lg:text-[3vw]` | `text-[10vw] md:text-[8vw] lg:text-[6vw]` |

---

## Zusammenfassung der Code-Änderungen

### src/components/DepartureDisplay.tsx

1. **Import hinzufügen:** `useMemo` von React
2. **StationSection entfernen:** Komplette Komponente (Zeilen 57-141)
3. **DepartureRow anpassen:**
   - Schriftgrössen verdoppeln
   - Replace-Pattern korrigieren: `/ Nord$/` statt `/, Bahnhof Nord$/`
4. **DateTimeDisplay:** Schriftgrössen verdoppeln
5. **DepartureDisplay neu strukturieren:**
   - Daten kombinieren und sortieren mit `useMemo`
   - Eine flache Liste statt zwei Sections
   - Trennlinie entfernen

