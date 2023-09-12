<template>
  <div class="wrapper">
    <div class="center">
      <img src="../assets/green_circle_check.png" alt="" />

      <h4>Vielen Dank, dass du dein Unternehmen registriert hast!</h4>

      <h6>
        Auf Schillerando Business kannst du jederzeit alle Informationen deines Unternehmens ändern, Mitarbeiter hinzufügen, Angebote erstellen und die Finanzen deines Unternehmens verwalten.
      </h6>

      <a href="/einstellungen" class="btn btn-primary">Schillerando Business</a>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'CompanyRegistratedView',
  setup() {
    const store = useStore()

    return {
      store
    }
  }
};
</script>

<style scoped>
.wrapper {
  display: table;
  width: 100%;
  height: 75vh;
}

.center {
  padding: 0 30px 0 30px;
  display: table-cell;
  vertical-align: middle;
}

img {
  max-width: 40%;
  max-height: 20vh;
  margin-bottom: 30px;
}

h4 {
  margin-bottom: 30px;
}

h6 {
  margin-bottom: 20px;
}

a {
  margin-top: 20px;
}
</style>
