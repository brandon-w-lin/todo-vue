<!-- Use this component to detect if the user has lost focus in the page -->
<!-- If so, can trigger an event (like syncing with the server) -->

<script>
export default {
  name: "DetectInactivity",
  props: {
    after: String,
  },
  data() {
    return {
      countdown: null,
    };
  },
  methods: {
    resetCountdown() {
      clearTimeout(this.countdown);
      this.countdown = setTimeout(() => {
        this.$emit("inactive");
        this.detectInactivity();
      }, this.after);
    },
    detectInactivity() {
      window.addEventListener("mousemove", () => {
        this.resetCountdown();
      });
      window.addEventListener("keypress", () => {
        this.resetCountdown();
      });
    },
  },
  created() {
    this.detectInactivity();
  },
};
</script>
