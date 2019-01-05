<script>
export default {
  beforeCreate() {
    const { params, query } = this.$route;
    console.log(query);
    const { path } = params;
    this.$router.replace({ path: "/" + path, query });
  },
  render: function(h) {
    return h(); // avoid warning message
  }
};
</script>
