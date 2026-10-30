# hannes-pauli.de

Persönliches Portfolio für Embedded Systems Development. Die öffentliche Oberfläche aus dem bisherigen Sites-Projekt wurde übernommen, Quellstand `9234b4f`. Die Seiten sind für GitHub Pages unter `https://hannes-pauli.de` vorbereitet. Es gibt hier keinen Worker, keine Datenbank und kein separates Postfach.

## Stand und noch fehlendes Setup

Diese Fassung ist ein Entwurf für den Umzug. Gewünscht ist die direkte Zustellung von Formularanfragen an das normale berufliche E-Mail-Postfach. Formspree ist dafür als noch nicht bestätigter Umsetzungsvorschlag vorbereitet. Es wurde kein Formspree-Konto eingerichtet und keine Formularadresse erfunden.

Der konkrete Formular-Endpoint fehlt. `site.config.json` enthält deshalb absichtlich einen leeren Wert für `formEndpoint`. Ein Build bricht damit vor dem Erzeugen der Veröffentlichungsdateien verständlich ab. Ein eigener serverseitiger Mailversand ohne zusätzlichen Formulardienst wird ebenfalls geprüft; Hosting, Versandzugang und Einrichtung sind noch offen. Falls dieser Weg gewählt wird, müssen Integration, Endpoint-Prüfung und Datenschutzhinweise entsprechend angepasst werden.

1. Im eigenen Formspree-Konto ein Formular anlegen, die normale berufliche E-Mail-Adresse als Empfänger wählen und bestätigen.
2. Die tatsächlich von Formspree angezeigte Adresse in `site.config.json` eintragen. Erlaubt ist ausschließlich `https://formspree.io/f/` mit der konkreten Formular-ID. Diese öffentliche Formularadresse ist kein API-Schlüssel.
3. Empfang, Antworten, Fehler und Spam-Einstellungen bei Formspree prüfen. Die Zustellung an das berufliche E-Mail-Postfach funktioniert erst nach korrekter Einrichtung und Bestätigung des Empfängers.
4. Die Datenschutzhinweise mit der tatsächlich gewählten Formspree-Konfiguration abgleichen, einschließlich etwaiger CAPTCHA-Funktionen und der anwendbaren Vereinbarungen zur Datenverarbeitung. Es wird keine vollständige Spamvermeidung zugesagt.

## Bauen und ansehen

Node.js 24 verwenden. Es sind keine externen Pakete oder Installationsschritte erforderlich.

```powershell
npm run build
python -m http.server 4176 --directory dist
```

Nach erfolgreichem Build liegt die fertige Webseite in `dist/`. Die Vorschau ist dann unter `http://127.0.0.1:4176` erreichbar. Nur `dist/` veröffentlichen. `site/` enthält vor dem Build einen nicht zur Auslieferung bestimmten Konfigurationsmarker für das Formular.

Lokale Links und Assets sind relativ, damit auch eine Vorschau unter einem GitHub-Repositorypfad funktioniert. Canonical- und Open-Graph-Adressen zeigen auf `https://hannes-pauli.de`. `noindex` bleibt vorerst erhalten.

## Kontaktformular

Das Formular sendet direkt an Formspree und soll von dort an das normale berufliche E-Mail-Postfach zugestellt werden. Ohne JavaScript wird eine normale Formularübermittlung verwendet. Formspree zeigt dann standardmäßig seine Bestätigungsseite an. Eine eigene Weiterleitung auf `https://hannes-pauli.de/kontakt-erhalten.html` lässt sich, sofern der gewählte Tarif sie unterstützt, in den Formspree-Einstellungen setzen. Es ist keine Weiterleitung konfiguriert.

Mit JavaScript wird derselbe `action`-Endpoint per `fetch` mit `credentials: 'omit'` verwendet. Der Honeypot heißt `_gotcha`. Empfang und Fehlermeldungen müssen nach Einrichtung mit und ohne JavaScript geprüft werden. Die Mengenbegrenzungen des alten Sites-Workers werden hier nicht übernommen; es gelten die eingerichteten Formspree-Einstellungen und Dienstgrenzen.

Die E-Mail-Adresse im Kontaktbereich erscheint nach Klick; im Impressum bleibt sie ohne JavaScript lesbar. Dies erschwert lediglich einfaches Auslesen.

## GitHub Pages und Domain

Der Workflow `.github/workflows/pages.yml` baut bei einem Push auf `main` oder einem manuellen Start und veröffentlicht ausschließlich `dist/`. Bei fehlender Formularadresse wird kein Artefakt hochgeladen und keine neue Version veröffentlicht. Im Repository ist GitHub Actions als Veröffentlichungsquelle eingestellt. Der Entwurf liegt zunächst auf `task/github-pages-umzug`.

Der Build erzeugt `CNAME` mit `hannes-pauli.de` sowie `.nojekyll`. `hannes-pauli.de` ist bereits als benutzerdefinierte Domain in GitHub Pages gespeichert. Die Domain wurde am 30.10.2026 durch einen zusätzlichen DNS-TXT-Nachweis erfolgreich für das eigene GitHub-Konto verifiziert; der Status steht unter [GitHub Settings](https://github.com/settings/pages). Diesen TXT-Eintrag beibehalten. Web- und E-Mail-Records wurden dabei nicht geändert. Die öffentliche Domain zeigt weiterhin auf die bisherige United-Domains-Parkseite.

Nach Einrichtung des Formularversands und erfolgreichem Build die Domainzuordnung prüfen. Anschließend bei United Domains nur die Webrecords anpassen:

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

- [Formspree-Dokumentation](https://help.formspree.io/)
- [Formspree: Honeypot](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering/)
- [Formspree: Sicherheit](https://formspree.io/security/)
- [Formspree: Datenschutz](https://formspree.io/legal/privacy-policy/)
- [GitHub Pages: eigene Workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
