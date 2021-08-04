<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
export default {
  async mounted() {
    const idToken = await this.$auth.getIdTokenClaims();
    console.log(idToken);
    // this.$auth.logout();
  },
};
</script>
