# Mitmachen

Das Wiki wächst über Pull Requests. Lies den Artikel, den du ändern willst,
prüfe deine Aussage und beschreibe im Pull Request kurz, was sich ändert und
warum.

## Berufsartikel hinzufügen oder ändern

Lege Dateien mit Kleinbuchstaben und Bindestrichen unter `content/berufe/` an.
Nutze dieses Frontmatter:

```yaml
---
title: Berufsname
description: Ein kurzer Beschreibungssatz.
tags: [Bereich]
aliases: [Alternativer Name]
---
```

Behalte die sechs Überschriften aus `content/templates/berufsartikel.md` bei.
Verlinke ähnliche Berufe mit `[[berufe/dateiname|Anzeigename]]`. Guides gehören
nach `content/guides/`, Bereiche nach `content/bereiche/`.

## Gute Pull Requests

- Schreibe konkret, verständlich und auf Deutsch.
- Trenne persönliche Erfahrung von allgemeiner Aussage.
- Nenne eine Quelle bei rechtlich oder finanziell relevanten Angaben.
- Prüfe lokal mit `npx quartz build`.
- Ändere nur, was zum Thema gehört.

Maintainer prüfen Inhalt, Verständlichkeit, Links und die Einhaltung dieser
Regeln. Das Projekt übernimmt die MIT-Lizenz aus dem Quartz-Template; sie steht
in `LICENSE.txt`.

