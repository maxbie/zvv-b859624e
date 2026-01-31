

# Zwei kleine Anpassungen

Basierend auf dem genehmigten Plan, hier die zwei zusätzlichen Änderungen.

---

## Änderung 1: Datum und Uhrzeit nebeneinander

### Aktuell (Zeile 24)
```tsx
return `${day}.${month}.${year}    ${time}`;
```
Das Format ist bereits nebeneinander mit Leerzeichen dazwischen. Das Problem ist wahrscheinlich, dass es auf kleinen Bildschirmen umbricht.

### Lösung
Die `DateTimeDisplay` Komponente bekommt `whitespace-nowrap`, damit Datum und Zeit immer auf einer Zeile bleiben:

```tsx
<div className="absolute top-[2vh] right-[2vw] text-led-amber-dim font-led text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] whitespace-nowrap">
```

---

## Änderung 2: " Nord" aus Ziel entfernen

### Aktuell
Das Ziel "Zürich Oerlikon, Bahnhof Nord" wird direkt aus der API übernommen.

### Lösung
In der `DepartureRow` Komponente wird " Nord" aus dem Zieltext entfernt:

```tsx
<span className="text-led-amber font-led ...">
  {destination.replace(/, Bahnhof Nord$/, "")}
</span>
```

Dies entfernt ", Bahnhof Nord" am Ende des Ziels, sodass nur "Zürich Oerlikon" angezeigt wird.

---

## Zusammenfassung

| Änderung | Zeile | Was |
|----------|-------|-----|
| Whitespace nowrap | 28 | `whitespace-nowrap` zur CSS-Klasse hinzufügen |
| " Nord" entfernen | 48 | `.replace(/, Bahnhof Nord$/, "")` auf destination |

