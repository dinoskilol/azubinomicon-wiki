import fs from "node:fs"
import path from "node:path"

const source = fs.readFileSync(
  "/home/hermes/projects/azubinomicon/src/data/ausbildungen.ts",
  "utf8",
)
const rows = [...source.matchAll(/item\('([^']+)', '([^']+)', (\d+(?:\.\d+)?), '([^']*)', '([^']*)'\)/g)].map(
  ([, category, name, duration, description, requirements]) => ({
    category,
    name,
    duration,
    description,
    requirements,
  }),
)

const slug = (value) => value
  .toLowerCase()
  .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

const durationText = (duration) => `${duration.replace(".5", ",5")} Jahre`
const link = (row) => `[[berufe/${slug(row.name)}|${row.name}]]`
const categories = [...new Set(rows.map((row) => row.category))]
const flagship = {
  "fachinformatiker-in-fuer-anwendungsentwicklung": {
    what: "Fachinformatikerinnen und Fachinformatiker der Fachrichtung Anwendungsentwicklung planen, programmieren und testen Software. Sie klären Anforderungen mit den späteren Nutzenden, teilen Aufgaben in kleine Schritte und pflegen Anwendungen nach dem Start weiter. Zum Beruf gehören auch Fehlersuche, Dokumentation und Versionsverwaltung.",
    bring: "Du solltest Probleme gern systematisch zerlegen und bereit sein, regelmäßig neue Werkzeuge und Programmiersprachen zu lernen. Schulnoten helfen bei der Bewerbung, aber ein kleines eigenes Projekt, ein nachvollziehbarer Lösungsweg und die Fähigkeit, Fragen zu stellen, sagen oft mehr aus.",
    work: "Typische Arbeitgeber sind Softwarehäuser, IT-Abteilungen von Industrie- und Handelsunternehmen, Agenturen und öffentliche Einrichtungen. Je nach Betrieb arbeitest du im Team mit Produktmanagement, Design, Support und Fachabteilungen.",
    career: "Nach der Ausbildung sind Spezialisierungen auf Webentwicklung, Datenbanken, Qualitätssicherung oder IT-Sicherheit möglich. Mit Berufserfahrung kommen Zertifikate, eine Aufstiegsfortbildung oder ein berufsbegleitendes Studium infrage.",
  },
  "fachinformatiker-in-fuer-systemintegration": {
    what: "In der Systemintegration planst, installierst und betreibst du IT-Systeme. Du richtest Arbeitsplätze ein, konfigurierst Netzwerke und Server, überwachst Dienste und unterstützt bei Störungen. Sicherheitsupdates, Backups und eine verständliche Dokumentation sind Teil des Alltags.",
    bring: "Wichtig sind Neugier auf Hardware und Netzwerke, Ruhe bei der Fehlersuche und ein verantwortungsvoller Umgang mit Zugängen und Daten. Du musst nicht alles wissen; du solltest aber sauber dokumentieren und Probleme verständlich erklären können.",
    work: "Du arbeitest in internen IT-Abteilungen, bei Systemhäusern, Rechenzentren oder Behörden. Je nach Arbeitgeber gehören Kundentermine, Rufbereitschaft oder Arbeit an verschiedenen Standorten dazu.",
    career: "Mögliche Schwerpunkte sind Cloud-Betrieb, Netzwerke, Linux, Microsoft-Systeme oder IT-Sicherheit. Fortbildungen wie die geprüfte IT-Fachwirt- oder IT-Spezialist-Schiene und ein Studium können anschließen.",
  },
  "elektroniker-in-fuer-betriebstechnik": {
    what: "Elektronikerinnen und Elektroniker für Betriebstechnik installieren, prüfen und warten elektrische Anlagen in Betrieben. Sie lesen Schaltpläne, messen Spannungen und Ströme, verdrahten Schaltschränke und suchen Fehler in Motoren, Sensoren und Steuerungen. Sicherheit beginnt vor jedem Messen und jeder Reparatur.",
    bring: "Du brauchst technisches Verständnis, Sorgfalt und Respekt vor elektrischer Energie. Mathematik und Physik helfen, aber genauso wichtig sind Fragen, Notizen und die Bereitschaft, Sicherheitsregeln auch unter Zeitdruck einzuhalten.",
    work: "Arbeitsplätze gibt es in Produktionsbetrieben, bei Energieversorgern, im Anlagenbau und bei technischen Dienstleistern. Die Arbeit findet in Werkstätten, Schaltschränken und Produktionshallen statt.",
    career: "Nach der Ausbildung sind Spezialisierungen auf Automatisierung, Gebäudetechnik oder Instandhaltung möglich. Der Meister, eine Technikerfortbildung und später ein Studium der Elektrotechnik sind typische Wege.",
  },
  "kfz-mechatroniker-in": {
    what: "Kfz-Mechatronikerinnen und Kfz-Mechatroniker warten und reparieren Fahrzeuge. Sie prüfen Bremsen, Fahrwerk und Antrieb, lesen Fehlerspeicher aus und arbeiten an Hochvolt- oder Assistenzsystemen. Die Diagnose verbindet praktische Arbeit mit Messgeräten und Herstellervorgaben.",
    bring: "Interesse an Fahrzeugen reicht allein nicht. Du solltest sorgfältig arbeiten, technische Zusammenhänge verstehen und Fehler anhand von Messwerten eingrenzen wollen. Körperliche Belastbarkeit und freundliche Kommunikation helfen im Werkstattteam und im Kundenkontakt.",
    work: "Du arbeitest in Autohäusern, freien Werkstätten, Fuhrparks oder bei Fahrzeugherstellern. Je nach Schwerpunkt stehen Pkw, Nutzfahrzeuge, Motorräder oder System- und Hochvolttechnik im Mittelpunkt.",
    career: "Mögliche Weiterbildungen führen zum Kfz-Meister, zur Serviceberatung oder zur Spezialisierung auf Hochvolt- und Diagnosetechnik. Mit Erfahrung sind auch Werkstattleitung und Ausbildung anderer möglich.",
  },
  "pflegefachmann-frau": {
    what: "Pflegefachkräfte planen, leisten und dokumentieren die Pflege von Menschen in unterschiedlichen Lebensphasen. Sie beobachten Veränderungen, führen ärztlich angeordnete Maßnahmen durch, beraten Angehörige und arbeiten mit dem gesamten Behandlungsteam. Der Beruf verlangt fachliche Entscheidungen ebenso wie menschliche Nähe.",
    bring: "Empathie ist wichtig, reicht aber nicht aus. Du brauchst Verantwortungsgefühl, körperliche und emotionale Belastbarkeit sowie die Bereitschaft, Hygiene- und Dokumentationsregeln zuverlässig einzuhalten. Praktika helfen, Schichtdienst und Patientenkontakt realistisch kennenzulernen.",
    work: "Mögliche Einsatzorte sind Krankenhäuser, Pflegeheime, ambulante Dienste, Reha-Einrichtungen und Hospize. Der Dienstplan kann Früh-, Spät-, Nacht- und Wochenenddienste enthalten.",
    career: "Nach der Ausbildung kannst du dich etwa für Intensivpflege, Praxisanleitung, Gerontopsychiatrie oder Leitung qualifizieren. Auch ein Studium in Pflegepädagogik, Pflegemanagement oder Pflegewissenschaft ist möglich.",
  },
  "kaufmann-frau-im-e-commerce": {
    what: "Kaufleute im E-Commerce betreuen Online-Shops und digitale Verkaufsprozesse. Sie pflegen Produktdaten, beobachten Kennzahlen, bearbeiten Bestellungen und koordinieren Marketing, Logistik und Kundenservice. Je nach Betrieb arbeitest du auch an Shop-Inhalten, Bezahlverfahren oder Marktplätzen.",
    bring: "Du solltest gern mit Menschen, Texten, Zahlen und digitalen Werkzeugen arbeiten. Genauigkeit bei Preisen und Produktinformationen ist genauso wichtig wie ein Blick für die Perspektive der Kundschaft. Grundkenntnisse in Tabellenkalkulation und Web sind hilfreich, aber lernbar.",
    work: "Arbeitgeber sind Online-Händler, Hersteller mit eigenem Shop, Agenturen und Unternehmen mit Marktplatzgeschäft. Die Aufgaben liegen meist im Büro, können aber eng mit Lager und Versand verbunden sein.",
    career: "Mögliche Schwerpunkte sind Shop-Management, Online-Marketing, Datenanalyse oder Kundenservice. Fortbildungen im E-Commerce, Fachwirt-Abschlüsse und ein Studium im Handel oder Marketing können anschließen.",
  },
  "industriekaufmann-frau": {
    what: "Industriekaufleute lernen viele kaufmännische Bereiche kennen: Einkauf, Verkauf, Auftragsabwicklung, Personal, Controlling und Rechnungswesen. Sie vergleichen Angebote, erstellen Kalkulationen, bearbeiten Bestellungen und stimmen Abläufe mit Produktion und Logistik ab.",
    bring: "Interesse an Wirtschaft und Zahlen ist hilfreich. Noch wichtiger sind sorgfältiges Arbeiten, verständliche Kommunikation und die Fähigkeit, Prioritäten zu setzen. Gute Tabellen- und Textverarbeitung wird im Alltag schnell wichtig.",
    work: "Du arbeitest in Industrieunternehmen in Büros oder gemischten Teams mit Produktion, Lager und Vertrieb. Viele Aufgaben laufen digital; gelegentlich gehören Gespräche mit Lieferanten oder Kundschaft dazu.",
    career: "Nach der Ausbildung kannst du dich auf Einkauf, Vertrieb, Personal oder Controlling konzentrieren. Fachwirt- und Bilanzbuchhalter-Fortbildungen oder ein berufsbegleitendes Studium eröffnen weitere Wege.",
  },
  "mechatroniker-in": {
    what: "Mechatronikerinnen und Mechatroniker bauen, prüfen und warten Systeme aus Mechanik, Elektronik und Steuerungstechnik. Sie montieren Baugruppen, verdrahten Anlagen, programmieren einfache Steuerungen und suchen Fehler mit Messgeräten und technischen Unterlagen.",
    bring: "Du solltest gern praktisch arbeiten und zugleich verstehen wollen, wie ein System als Ganzes funktioniert. Mathematik, räumliches Denken und Geduld bei der Fehlersuche helfen. Saubere Dokumentation und Arbeitsschutz gehören fest dazu.",
    work: "Arbeitsplätze gibt es im Maschinen- und Anlagenbau, in Produktionsbetrieben, bei Automatisierern und im technischen Service. Je nach Betrieb arbeitest du in Montage, Instandhaltung oder beim Kunden.",
    career: "Mögliche Spezialisierungen liegen in Automatisierung, Robotik, Inbetriebnahme oder Service. Meister- und Technikerfortbildungen sowie ein Studium der Mechatronik sind anschließende Optionen.",
  },
  "koch-koechin": {
    what: "Köchinnen und Köche planen Arbeitsabläufe, bereiten Lebensmittel vor und kochen Speisen nach Rezept oder eigener Planung. Dazu kommen Warenannahme, Lagerung, Hygiene, Kalkulation und die Abstimmung mit Service und Küche. In Stoßzeiten zählt gute Vorbereitung mehr als improvisiertes Heldentum.",
    bring: "Du brauchst Teamfähigkeit, Belastbarkeit und Interesse an Lebensmitteln. Arbeitszeiten liegen oft früh, spät oder am Wochenende. Sorgfalt bei Hygiene und Allergenen ist nicht verhandelbar.",
    work: "Du arbeitest in Restaurants, Hotels, Kantinen, Krankenhäusern, Pflegeeinrichtungen oder Cateringbetrieben. Die Küche ist meist warm, laut und zeitweise sehr schnell; dafür siehst du direkt, was dein Team erstellt.",
    career: "Weiterbildungen führen etwa zur Küchenleitung, zum Küchenmeister oder in die Betriebswirtschaft. Auch Spezialisierungen auf Patisserie, Gemeinschaftsverpflegung oder nachhaltige Küche sind möglich.",
  },
  "erzieher-in": {
    what: "Erzieherinnen und Erzieher begleiten Kinder, Jugendliche oder Menschen mit Unterstützungsbedarf im Alltag. Sie beobachten Entwicklung, planen pädagogische Angebote, führen Gespräche und arbeiten mit Familien, Schulen und anderen Fachstellen zusammen. Beziehungsgestaltung und Dokumentation gehören zusammen.",
    bring: "Du solltest geduldig, zuverlässig und bereit sein, dein eigenes Handeln zu reflektieren. Freude an Menschen ist wichtig, aber ebenso klare Grenzen, Teamarbeit und ein professioneller Umgang mit Konflikten. Die Ausbildungsform und Vergütung unterscheiden sich je nach Bundesland.",
    work: "Mögliche Einrichtungen sind Kindertagesstätten, Jugendhilfe, Ganztagsschulen, Heime und Einrichtungen für Menschen mit Behinderung. Der Alltag wechselt zwischen Gruppenarbeit, Gesprächen, Planung und Beobachtung.",
    career: "Mögliche Wege führen in Fachberatung, Leitung, Heilpädagogik oder Praxisanleitung. Zusatzqualifikationen und Studiengänge in Sozialpädagogik oder Kindheitspädagogik erweitern die Auswahl.",
  },
  "it-system-elektroniker-in": {
    what: "IT-System-Elektronikerinnen und IT-System-Elektroniker installieren und vernetzen IT-Systeme. Sie planen Anschlüsse, richten Geräte und Kommunikationssysteme ein, prüfen Stromversorgung und Netzwerke und helfen Kundinnen und Kunden bei Störungen. Der Beruf verbindet Service mit Elektrotechnik.",
    bring: "Du solltest technische Fehler Schritt für Schritt eingrenzen können und gern mit Menschen sprechen. Sorgfalt bei Strom, Datenschutz und Dokumentation ist zentral. Ein grundlegendes Verständnis für Netzwerke und Betriebssysteme wächst in der Ausbildung.",
    work: "Du arbeitest bei IT-Dienstleistern, Netzbetreibern, Systemhäusern oder in technischen Abteilungen. Kundentermine, Montage und Arbeit am Schreibtisch wechseln sich häufig ab.",
    career: "Spezialisierungen auf Netzwerke, Kommunikationstechnik, Cloud oder Sicherheit sind möglich. Fachwirt-, Techniker- und Meisterfortbildungen sowie ein technisches Studium kommen infrage.",
  },
  "vermessungstechniker-in": {
    what: "Vermessungstechnikerinnen und Vermessungstechniker erfassen Grundstücke, Gelände und Bauwerke mit GNSS, Tachymetern und digitalen Verfahren. Sie prüfen Messungen, verarbeiten Daten und erstellen Pläne oder digitale Modelle. Präzision im Feld und Sorgfalt am Rechner sind gleichermaßen wichtig.",
    bring: "Mathematik und räumliches Denken helfen dir. Du solltest bei Wetter und wechselnden Einsatzorten praktisch arbeiten können und Messwerte nicht einfach ungeprüft übernehmen. Interesse an Karten, Technik und rechtlichen Grundlagen ist ein guter Start.",
    work: "Arbeitgeber sind Vermessungsbüros, Bauunternehmen, Kommunen und Katasterbehörden. Ein Teil der Arbeit findet draußen auf Baustellen oder Grundstücken statt, der andere im Büro mit CAD- und Vermessungssoftware.",
    career: "Mögliche Schwerpunkte sind Bauvermessung, Geoinformation, Kataster oder 3D-Erfassung. Technikerfortbildungen, der staatliche Vermessungstechniker und ein Studium der Geodäsie sind mögliche nächste Schritte.",
  },
}

fs.mkdirSync("content/berufe", { recursive: true })
fs.mkdirSync("content/bereiche", { recursive: true })
for (const category of categories) {
  const categoryRows = rows.filter((row) => row.category === category)
  const categorySlug = slug(category)
  fs.writeFileSync(`content/bereiche/${categorySlug}.md`, `---\ntitle: ${JSON.stringify(category)}\ndescription: Ausbildungsberufe im Bereich ${category}.\ntags: [Bereich]\n---\n\n${category} umfasst unterschiedliche Wege in Ausbildung und Beruf. Die Auswahl unten ist ein Einstieg; Anforderungen und konkrete Aufgaben unterscheiden sich je nach Betrieb und Einsatzort.\n\n${categoryRows.map(link).join("\n") }\n`)
}

for (let index = 0; index < rows.length; index++) {
  const row = rows[index]
  const articleSlug = slug(row.name)
  const related = rows.filter((candidate) => candidate.category === row.category && candidate.name !== row.name).slice(0, 3)
  const detail = flagship[articleSlug] ?? {
    what: `${row.description} Im Alltag gehören dazu je nach Betrieb Vorbereitung, Dokumentation, Abstimmung im Team und das Einhalten von Qualitäts- und Sicherheitsregeln. Die konkrete Mischung hängt vom Einsatzort und vom Schwerpunkt der Ausbildung ab.`,
    bring: `${row.requirements}. Außerdem helfen Lernbereitschaft, Zuverlässigkeit und die Bereitschaft, Rückfragen zu stellen. Ein Praktikum oder Schnuppertag zeigt dir, ob Arbeitsumgebung und Aufgaben zu dir passen.`,
    work: `Typische Arbeitgeber sind Betriebe, Einrichtungen und Dienstleister aus dem Bereich ${row.category}. Du arbeitest je nach Schwerpunkt im Team, im Büro, in Werkstätten, auf Baustellen oder direkt mit Kundinnen und Kunden.`,
    career: `Mit Berufserfahrung kannst du dich auf Aufgaben in deinem Fachgebiet spezialisieren oder Verantwortung im Team übernehmen. Je nach Beruf kommen Fortbildungen, ein Meister- oder Technikerabschluss und ein berufsbegleitendes Studium infrage.`,
  }
  const markdown = `---\ntitle: ${JSON.stringify(row.name)}\ndescription: ${JSON.stringify(row.description)}\ntags: [${JSON.stringify(row.category)}]\naliases: [${JSON.stringify(row.name.replaceAll("/", " "))}]\n---\n\n## Was macht man in diesem Beruf?\n\n${detail.what}\n\n## Wie lange dauert die Ausbildung?\n\nDie Ausbildung dauert in der Regel ${durationText(row.duration)}. Eine Verkürzung oder Verlängerung ist unter bestimmten Voraussetzungen möglich; frag dazu die zuständige Kammer oder den Ausbildungsbetrieb.\n\n## Was sollte man mitbringen?\n\n${detail.bring}\n\n## Wo arbeitet man?\n\n${detail.work}\n\n## Karriere und Weiterbildung\n\n${detail.career}\n\n## Ähnliche Berufe\n\n${related.map(link).join("\n")}\n`
  fs.writeFileSync(`content/berufe/${articleSlug}.md`, markdown)
}

console.log(`Erstellt: ${rows.length} Berufsartikel und ${categories.length} Bereichsseiten.`)
