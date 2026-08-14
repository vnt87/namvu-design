import type { OpenDesignPluginCopy } from '../open-design-plugin-i18n';

const de: OpenDesignPluginCopy = {
  metadata: {
    title: 'NamVu Design für Codex/ChatGPT | NamVu Design Cloud Plugin installieren',
    description:
      'Installieren Sie NamVu Design Cloud in Codex/ChatGPT und erstellen Sie Websites, Präsentationen, Prototypen und Designsysteme direkt in derselben Aufgabe.',
    keywords:
      'NamVu Design Codex Plugin, ChatGPT Desktop Plugin, Codex Plugin installieren, NamVu Design Cloud, Codex Design Plugin, Codex MCP',
  },
  hero: {
    title: 'NamVu Design Plugin für Codex/ChatGPT',
    leadBefore: 'Geben Sie die folgende Anweisung in eine beliebige Aufgabe in Ihrer',
    chatgptLabel: 'ChatGPT-Desktop-App ein',
    installAria: 'NamVu Design Cloud in Codex/ChatGPT installieren',
    copy: 'Kopieren',
    github: 'Installationsanleitung auf GitHub öffnen ↗',
  },
  demo: {
    title: 'Einmal installieren. Direkt aus Codex/ChatGPT gestalten.',
    lead:
      'Sehen Sie sich zuerst den vollständigen Arbeitsbereich von Codex und NamVu Design an und folgen Sie anschließend dem echten Ablauf von der Installation bis zum Ergebnis.',
    overviewAlt:
      'Eine echte Codex-Aufgabe mit dem NamVu Design Plugin neben der fertigen Goodfield-Café-Website',
    overviewLabel: 'Echte Codex-Aufgabe',
    overviewCaption:
      'Prompt, Übergabe an NamVu Design, generierte Dateien und fertige Website bleiben in einem Arbeitsbereich sichtbar.',
    stepListAria: 'Die fünf Phasen eines echten Durchlaufs mit dem Codex Plugin',
    installPhase: 'Installieren',
    installTitle: 'Codex mit der Installation beauftragen',
    installBody:
      'Fügen Sie diese Anweisung in eine Codex-Aufgabe ein. Codex fügt die kanonische Git-Marketplace-Quelle hinzu, installiert das Plugin nur, wenn es fehlt, und schließt die Einrichtung des lokalen MCP ab, ohne dass ein Eintrag in einem öffentlichen Katalog erforderlich ist.',
    installNote: 'Einmal in Codex einfügen – alle Installationsschritte werden für Sie erledigt.',
    steps: [
      {
        phase: 'Verwenden',
        title: 'Eine neue Codex-Aufgabe starten',
        body:
          'Nachdem Codex die Installation abgeschlossen hat, öffnen Sie das installierte NamVu Design Plugin in einer neuen Aufgabe und wählen Sie „Try now“, um zu beginnen.',
        alt: 'Die echte Detailansicht des NamVu Design Plugins in Codex mit der Schaltfläche Try now',
      },
      {
        phase: 'Erstellen',
        title: 'Das Design-Briefing formulieren',
        body:
          'Erwähnen Sie NamVu Design und beschreiben Sie anschließend das gewünschte Ergebnis, die Inhalte, die visuelle Richtung und die Anforderungen an die responsive Darstellung.',
        alt: 'Ein echter Codex-Prompt, der NamVu Design mit einer einladenden Website für ein Nachbarschaftscafé beauftragt',
      },
      {
        phase: 'Erstellen',
        title: 'Die Übergabe live verfolgen',
        body:
          'Codex bestätigt die Richtung, legt das Projekt an und übergibt die Arbeit an NamVu Design, während die Dateien live erscheinen.',
        alt: 'Ein echter Arbeitsbereich von Codex und NamVu Design während der Erstellung der Website für das Nachbarschaftscafé',
      },
      {
        phase: 'Erstellen',
        title: 'Das Ergebnis prüfen',
        body:
          'Dieselbe Aufgabe liefert die responsive Landingpage des Goodfield Cafés sowie die generierten Bilder und bearbeitbaren Dateien zurück.',
        alt: 'Die fertige Landingpage des Goodfield Nachbarschaftscafés, erstellt mit dem NamVu Design Plugin in Codex',
      },
    ],
  },
  use: {
    title: 'Mit dem exakten Prompt starten.',
    lead:
      'Wählen Sie NamVu Design im Plugin-Menü von Codex aus, beschreiben Sie das gewünschte Ergebnis und verfeinern Sie es in derselben Aufgabe weiter. Codex stellt die Plugin-Erwähnung als NamVu Design Chip dar.',
    promptLabel: 'Prompt aus der aufgezeichneten Codex-Aufgabe',
    copyPrompt: 'Codex-Prompt kopieren',
    galleryAria: 'Mit NamVu Design erstellte Beispiele',
    templates: [
      {
        alt: 'Oryzo-Produkt-Landingpage mit einer haptischen Schneidematte und einem Objekt aus Kork',
        label: 'Produkt-Launch',
      },
      {
        alt: 'NamVu Design Osaka Event-Landingpage mit typografisch gestalteter Karte',
        label: 'Eventseite',
      },
      {
        alt: 'Dunkle, redaktionell gestaltete Produktwebsite für Fable 5',
        label: 'Redaktionelle Website',
      },
      {
        alt: 'Interaktive NamVu Design Modell-Zeitleiste auf einer hellen Arbeitsfläche',
        label: 'Interaktive Story',
      },
    ],
    promptListAria: 'Prompt-Beispiele für NamVu Design Cloud',
    prompts: [
      { title: 'Website' },
      { title: 'Präsentationen' },
      { title: 'Prototyp' },
      { title: 'Designsystem' },
    ],
  },
  faq: {
    title: 'Fragen vor der Installation',
    lead: 'Codex behält die Kontrolle über die Aufgabe. NamVu Design übernimmt den visuellen Workflow.',
    items: [
      {
        q: 'Welche Funktionen ergänzt das Plugin in Codex?',
        a:
          'Es erweitert Codex um einen NamVu Design Workflow für Websites, Präsentationen, Prototypen und Designsysteme. Für Briefings, Projekte und die Erstellung von Ergebnissen verbindet sich das Plugin mit dem lokalen NamVu Design MCP.',
      },
      {
        q: 'Welche Codex-Produkte werden unterstützt?',
        a:
          'Das aktuelle Paket unterstützt Codex Desktop und Codex CLI. Codex ist der erste unterstützte Host.',
      },
      {
        q: 'Was benötige ich vor der Installation?',
        a:
          'Verwenden Sie Codex CLI 0.144.6 oder neuer und NamVu Design 0.17.0 oder neuer. Installieren Sie NamVu Design, bevor Sie das lokale MCP registrieren.',
      },
      {
        q: 'Warum benötige ich eine neue Codex-Aufgabe?',
        a:
          'Codex lädt Plugin- und MCP-Funktionen beim Start einer Aufgabe. Eine neue Aufgabe erkennt das soeben installierte NamVu Design Cloud Plugin.',
      },
      {
        q: 'Muss das NamVu Design Fenster geöffnet bleiben?',
        a:
          'Nein. Das registrierte lokale MCP kann die signierte NamVu Design Laufzeit bei Bedarf ohne sichtbare Benutzeroberfläche starten.',
      },
    ],
  },
  final: {
    aria: 'NamVu Design Cloud in Codex/ChatGPT installieren',
    title: 'NamVu Design in Ihrer nächsten Codex/ChatGPT-Aufgabe nutzen.',
    bodyBeforeMention: 'Installieren Sie das Plugin, verbinden Sie das lokale MCP und rufen Sie',
    bodyAfterMention: 'auf.',
    copy: 'Kopieren',
    download: 'NamVu Design herunterladen',
    source: 'Quellcode ansehen',
  },
  clipboard: {
    copying: 'Wird kopiert…',
    copied: 'Kopiert',
    failed: 'Auswählen und kopieren',
  },
  schema: {
    pageName: 'NamVu Design Cloud Plugin für Codex/ChatGPT',
    applicationName: 'NamVu Design Cloud Plugin für Codex/ChatGPT',
  },
};

export default de;
