<template>
  <AlertBanner title="Coming Soon" />
  <TitleDiv title="Services" />
  <InfoDiv info="Hier hast du in Zukunft eine Übersicht über alle Services, die Schillerando anbietet. Du kannst Services wie Lieferung von Waren aus dem Ausland oder Müllentsorgung buchen. Außerdem kannst du die Hilfe eines Schillerando Mitarbeiters anfordern, wenn du Probleme mit der Verwaltung deines Unternehmens oder der Buchhaltung hast." />

</template>

<script>
import TitleDiv from '@/shared/components/TitleDiv';
import InfoDiv from '../components/InfoDiv';
import AlertBanner from '../components/AlertBanner';

export default {
  name: 'ServiceInfoView',
  components: {
    TitleDiv,
    AlertBanner,
    InfoDiv
  },
};
</script>
