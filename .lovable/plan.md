
# Scrollbar-Problem beheben

## Ursache

Das Problem entsteht durch zwei Faktoren:

1. **Index.tsx (Zeile 5)**: Der Container nutzt `min-h-screen` statt `h-screen`
   - `min-h-screen` = *mindestens* 100vh (kann grösser werden)
   - `h-screen` = *genau* 100vh (feste Höhe)

2. **Fehlendes `overflow-hidden`**: Ohne diese Eigenschaft wird der überlaufende Inhalt scrollbar gemacht

## Lösung

### Datei: `src/pages/Index.tsx`

```text
Aktuell:
<div className="min-h-screen w-full bg-led flex flex-col">

Neu:
<div className="h-screen w-full bg-led flex flex-col overflow-hidden">
```

| Änderung | Effekt |
|----------|--------|
| `min-h-screen` → `h-screen` | Feste Höhe von genau 100vh |
| `+ overflow-hidden` | Versteckt überlaufenden Inhalt und entfernt Scrollbar |

Dies stellt sicher, dass der gesamte Inhalt innerhalb des Viewports bleibt und kein Scrollen möglich ist - ideal für eine Fullscreen-Anzeige im 4:3-Format.
