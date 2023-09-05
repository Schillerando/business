<template>
  <div> 
    <h1>Allgemeine Geschäftsbedingungen von „Schillerando“ gegenüber Unternehmen</h1>

    <h3>§1 Bedingungen gegenüber Unternehmen und Begriffsdefinitionen</h3>

    <p>(1) Die nachfolgenden Allgemeinen Geschäftsbedingungen gelten für alle Unternehmen, die Waren oder Dienstleistungen über Schillerando erwerben oder verkaufen, im Folgenden auch Auftraggeber genannt, in ihrer zum Zeitpunkt der Bestellung gültigen Fassung. </p>

    <h3>§2 Zustandekommen eines Vertrages, Speicherung des Vertragstextes</h3>

    <p>(1) Die folgenden Regelungen über den Vertragsabschluss gelten für Leistungen von Schillerando gegenüber Unternehmen. Der Auftraggeber verpflichtet sich, im Auftrag seines Unternehmens zu handeln. <br /><br />
      (2) Anfallende Kosten werden mit dem Auftraggeber persönlich abgerechnet, sollte sich das angegebene Unternehmen als nicht existent erweisen.</p>

    <h3>(3) Im Falle des Vertragsschlusses kommt der Vertrag zwischen</h3>

    <p>Schillerando<br />
      Schulstraße 34<br />
      D-71672 Marbach</p>

    <h3>Und dem auftraggebenden Unternehmen zustande.</h3>

    <p>(3) Die Präsentation der Dienstleistungen stellt kein rechtlich bindendes Vertragsangebot dar, sondern dient lediglich der unverbindlichen Information. Mit der Bestellung des gewünschten Abonnements oder der gewünschten Dienstleistung gibt das Unternehmen ein verbindliches Angebot auf Abschluss eines Kaufvertrages ab. Gültig wird der Vertrag nach Annahme des Angebots durch Schillerando.
      <br />
      <br />
    (4) Speicherung des Vertragstextes:
    Schillerando speichert den Vertragstext, sowie das Einverständnis unserer Kunden. 
    Die AGB kann jederzeit auch unter <a :href="businessUrl + '/agb'">https://www.business.schillerando.de/agb</a> eingesehen werden.</p>

    <h3>§3 Preise, Zahlung, Fälligkeit</h3>

    <p>(1) Im Falle einer Bestellung werden zu liefernde Produkte von einem Schillerando Lieferanten bezahlt. Schillerando rechnet die Kosten eigenständig mit dem Besteller ab.
      <br />
      <br />
    (2) Der Auftraggeber verpflichtet sich, den vollen Preis einer Dienstleistung zu zahlen. Sollte die Zahlung zum Zeitpunkt der Fertigstellung des gewählten Service noch nicht erfolgt sein, behält sich Schillerando eine Auflösung des Vertrags vor. Hierbei können Strafgebühren für den Auftraggeber anfallen.
    </p>

    <h3>§4 Abonnements</h3>

    <p>(1) Schillerando bietet drei verschiedene Abonnements für Unternehmen an. Die Anmeldung ist vor und während des Projektes möglich. Beim Abschluss vor Projektstart sind die Gebühren am ersten Tag des Projekts zu bezahlen, bei Abschluss während des Projekts am Tag des Abschlusses.
      <br />
      <br />
    (2) Folgende Abonnements werden angeboten:
    <br />
    <br />
    Abo 1 (Standard): <br />
    Kostenlose Buchhaltung<br />
    Gebührenpflichtige Lieferungen*<br />
    Gebührenpflichtige Services<br />
    Kosten: 50$**<br />
    <br />
    Abo 2 (Delivery): <br />
    Kostenlose Buchhaltung<br />
    Kostenlose Lieferungen<br />
    Gebührenpflichtige Services<br />
    Kosten: 100$**<br />
    <br />
    Abo 3 (Business): <br />
    Kostenlose Buchhaltung<br />
    Kostenlose Lieferungen<br />
    Kostenlose Services<br />
    Kosten: 200$**<br />
    <br />
    *Zu Abo 1 (Standard): Bei Abo 1 (Standard) werden 5% Lieferkosten des Bestellwerts fällig. Daher bezahlt der Schillerando Lieferant bei Abholung einer Bestellung 95% der regulären Kosten. <br />
    <br />
    **$ entspricht der Staatswährung, in der die Kosten des ausgewählten Abos bezahlt werden müssen. (1$ ≙ 0,1€)<br />
    <br />
    Sollten die Abokosten nicht zur vereinbarten Frist bezahlt werden, so hält sich Schillerando das Recht vor, alle Angebote wieder zu entfernen.<br />
    <br />
    Bei zeitlich begrenzten Rabatten auf die Abo Preise, wird der Preis fällig, der zum Zeitpunkt der Auswahl beworben wurde.
    <br />
    <br />
    (3) Bei Registrierung ohne Abonnement wird das Unternehmen weder im Onlineshop angezeigt noch hat es Zugriff auf Schillerando Business.
    </p>

    <h3>§5 Sonstige Leistungen</h3>

    <p>(1) Sonstige gewählte Leistungen werden nach Abschluss der Leistung in Rechnung gestellt.</p>

    <h3>§6 Vertragssprache</h3>

    <p>(1) Als Vertragssprache steht ausschließlich Deutsch zur Verfügung.</p>

    <h3>§7 Sonstiges</h3>

    <p>(1) Schillerando gibt keine Garantie, dass durch ein gekauftes Abonnement der Umsatz des Unternehmens steigt.<br />
      <br />
    (2) Die Reihenfolge der Auflistung auf der Schillerando Website kann nicht extern beeinflusst werden und ist nicht veränderbar.
    </p>

    <h6>Stand der AGB: Mai 2023</h6>

  </div>
  
</template>

<script>
export default {
  name: 'AGB',
  data() {
    return {
      businessUrl: process.env.VUE_APP_BUSINESS_URL,
    };
  }
};
</script>

<style scoped>

div {
  text-align: left;
}

h1 {
  text-align: center;
  margin-bottom: 50px;
}

h3 {
  font-weight: 800;
  font-size: 1rem;
  margin: 20px 0;
}

h6 {
  font-size: 0.8rem;
}

</style>
