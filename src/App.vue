<template>
  <div class="dada-demo">
    <p class="dada-demo__body">{{ i18n.dialogBody }}</p>
    <button class="b3-button b3-button--outline" @click="count++">
      {{ i18n.demoClicked }}: {{ count }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  i18n: {
    type: Object,
    required: true,
  },
});

const count = ref(0);
</script>
