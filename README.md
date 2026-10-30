# hannes-pauli.de

Persönliches Portfolio für Embedded Systems Development, bereitgestellt mit GitHub Pages und vorgesehen für `https://hannes-pauli.de`. Der Kontakt erfolgt über einen direkten E-Mail-Button: Er öffnet das E-Mail-Programm des Besuchers mit einer neuen Nachricht an die berufliche Adresse. Die Webseite verarbeitet oder versendet selbst keine Formularnachrichten.

## Stand

Die statische Webseite wurde am 30.10.2026 erstmals erfolgreich mit GitHub Actions auf GitHub Pages bereitgestellt. Der Umzugs-PR 1 ist zusammengeführt. Die E-Mail-Zustellung übernimmt das vom Besucher verwendete E-Mail-Programm zusammen mit dessen Anbieter. Für den Betrieb der Webseite sind keine Formularanbieter, SMTP-Zugangsdaten oder eigenen Backenddienste erforderlich.

Die Domainverifizierung für das eigene GitHub-Konto wurde am 30.10.2026 abgeschlossen. Die Webrecords zeigen weiterhin auf die United-Domains-Parkseite; die Umschaltung auf GitHub Pages steht aus. Die United-Domains-Sitzung ist während der Einrichtung abgelaufen; die Speicherversuche wurden abgewiesen und die erneute Anmeldung ist noch erforderlich. Bestehende Mailrecords bleiben erhalten.

## Bauen und ansehen

Node.js 24 verwenden. Es sind keine externen Pakete, Installationsschritte oder Endpoint-Konfigurationen erforderlich.

```powershell
npm run build
python -m http.server 4176 --directory dist
```

Nach erfolgreichem Build liegt die fertige Webseite in `dist/`. Die Vorschau ist unter `http://127.0.0.1:4176` erreichbar. Ausschließlich `dist/` veröffentlichen.

Der Build übernimmt nur reguläre `.html`-, `.css`-, `.js`- und `.svg`-Dateien aus `site/`. Er prüft alle Dateien vor dem Export und bricht bei nicht vorgesehenen Quelldateien oder alten Formular-/QA-Verweisen wie `__FORM_ENDPOINT__` und `__qa` verständlich ab. Nach erfolgreicher Prüfung wird `dist/` vollständig erneuert; dadurch bleiben keine alten Konfigurations- oder Veröffentlichungsdateien zurück. Zusätzlich entstehen `CNAME` mit `hannes-pauli.de` und `.nojekyll`.

`fonts.css` enthält lokal eingebettete WOFF2-Schriften als Data-URLs sowie die zugehörigen Lizenz- und Herkunftsangaben. Die Schriften erfordern keine externen Fontanfragen. Lokale Links und Assets sind relativ, damit auch eine Vorschau unter einem GitHub-Repositorypfad funktioniert. Canonical- und Open-Graph-Adressen zeigen auf `https://hannes-pauli.de`.

## E-Mail-Kontakt

Der E-Mail-Button verwendet einen `mailto:`-Link. Der Besucher formuliert und versendet seine Nachricht im eigenen E-Mail-Programm. Ein Klick allein sendet keine Nachricht, und die Webseite kann den späteren Versand oder Empfang nicht bestätigen. Ein lokal eingerichtetes E-Mail-Programm oder eine passende Webmail-Zuordnung ist dafür erforderlich.

Die veröffentlichte berufliche E-Mail-Adresse kann aus dem Link ausgelesen werden; ein vollständiger Schutz vor unerwünschten Nachrichten wird nicht zugesagt.

## GitHub Pages und Domain

Der Workflow `.github/workflows/pages.yml` baut bei einem Push auf `main` oder einem manuellen Start und veröffentlicht ausschließlich `dist/`. Ein abgebrochener Build erzeugt kein neues Veröffentlichungsartefakt. Im Repository ist GitHub Actions als Veröffentlichungsquelle eingestellt. Die Umzugsvorbereitung aus `task/github-pages-umzug` ist in `main` übernommen. `noindex` bleibt bis zur abschließenden Inhaltsfreigabe gesetzt.

Der Build erzeugt `CNAME` mit `hannes-pauli.de` sowie `.nojekyll`. `hannes-pauli.de` ist bereits als benutzerdefinierte Domain in GitHub Pages gespeichert. Die Domain wurde am 30.10.2026 durch einen zusätzlichen DNS-TXT-Nachweis erfolgreich für das eigene GitHub-Konto verifiziert; der Status steht unter [GitHub Settings](https://github.com/settings/pages). Diesen TXT-Eintrag beibehalten. Web- und E-Mail-Records wurden dabei nicht geändert. Die öffentliche Domain zeigt weiterhin auf die bisherige United-Domains-Parkseite.

Nach erfolgreichem Build und Prüfung der fertigen Webseite die Domainzuordnung kontrollieren. Anschließend bei United Domains ausschließlich die Webrecords anpassen:

| Name | Typ | Ziel |
| --- | --- | --- |
| `@` | `A` | `185.199.108.153` |
| `@` | `A` | `185.199.109.153` |
| `@` | `A` | `185.199.110.153` |
| `@` | `A` | `185.199.111.153` |
| `www` | `CNAME` | `hp-8472.github.io` |

Die bisherigen Web-A-Records `89.31.143.90` werden dabei ersetzt. Bestehende E-Mail-Einträge, insbesondere MX, SPF, DKIM und DMARC, sowie Nameserver unverändert lassen. Nach erfolgreicher DNS-Prüfung die HTTPS-Bereitstellung prüfen und HTTPS erzwingen. Die bisherige Sites-Webseite bleibt bis zur abgeschlossenen Umschaltung erreichbar.

Details: [GitHub-Domainkonfiguration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Offizielle Hinweise

- [GitHub Pages: eigene Workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages: Domainverifizierung](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
