

# Smiley statt Bus/Tram Icons

Ersetzt die Lucide-Icons durch das Unicode-Smiley-Zeichen aus der Nose Transport Font.

---

## Aktuelle Situation

Bei Abfahrten in 0 Minuten werden aktuell unterschiedliche Lucide-Icons angezeigt:
- **Tram**: `TramFront` Icon
- **Bus**: `Bus` Icon

Diese Icons sind SVG-basiert und passen nicht zum Dot-Matrix-Look der Nose Transport Font.

---

## Geplante Änderung

### src/components/DepartureDisplay.tsx

**Entfernen:**
- Import von `TramFront` und `Bus` aus `lucide-react`
- Unterscheidung zwischen Tram und Bus (wird nicht mehr benötigt)

**Ändern:**
Die gesamte Icon-Logik wird durch ein einfaches Unicode-Zeichen ersetzt:

```tsx
// Vorher (Zeilen 58-66):
{minutes === 0 ? (
  isTram ? (
    <TramFront className="..." />
  ) : (
    <Bus className="..." />
  )
) : (
  <span>{minutes}'</span>
)}

// Nachher:
{minutes === 0 ? (
  <span>☺</span>  // U+263A - White Smiling Face
) : (
  <span>{minutes}'</span>
)}
```

**Vereinfachungen:**
- Die `isTram` Variable wird nicht mehr benötigt
- Der `category` Parameter kann aus `DepartureRow` entfernt werden
- Kein Lucide-Import mehr nötig

---

## Vorteile

| Aspekt | Vorher | Nachher |
|--------|--------|---------|
| **Konsistenz** | SVG-Icons | Nativer Font-Glyph |
| **Dot-Matrix-Look** | Fremd | Authentisch |
| **Responsiveness** | Manuelle Grössenanpassung | Skaliert mit Font |
| **Code** | Komplexe Logik | Einfaches Zeichen |

---

## Technische Details

- **Unicode**: U+263A (☺) - "White Smiling Face"
- Der Glyph wird automatisch in der Nose Transport Font im Dot-Matrix-Stil dargestellt
- Die Schriftgrösse skaliert bereits responsiv mit den Viewport-Units (`vw`)
- Keine zusätzlichen CSS-Anpassungen nötig

