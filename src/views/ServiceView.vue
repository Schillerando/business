<template>
  <TitleDiv title="Services" />

  <div class="list">
    <ServiceTile title="Support" description="Du hast Probleme mit der Verwaltung deines Unternehmens, dem Einstellen deines Angebote oder der Buchhaltungssoftware? Rufe einen Schillerando-Mitarbeiter um dir beim Umgang mit Schillerando oder Schillerando Business zu helfen." icon="&#x1F91D;" price="0" />
    <ServiceTile title="Müllentsorgung" description="Ein Schillerando-Mitarbeiter entsorgt den Müll deines Unternehmens" icon="&#x1F5D1;&#xFE0F;" price="10" />
    <ServiceTile title="Wareneinkauf" description="Dir gehen im Verlauf eines Tages die Waren aus und du hast keine Möglichkeit für den nächsten Tag neue zu besorgen? Wir kaufen neue Ware für dein Unternehmen im Ausland ein! Alle Details werden persönlich mit einem Schillerando-Mitarbeiter vereinbart." icon="&#128666;" price="50" />
  </div>
  
</template>

<script>
import TitleDiv from '../components/TitleDiv';
import ServiceTile from '../components/ServiceTile';

export default {
  name: 'ServiceView',
  components: {
    TitleDiv,
    ServiceTile
  },
};
</script>

<style scoped>
.list {
  margin: 0 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
}
</style>
