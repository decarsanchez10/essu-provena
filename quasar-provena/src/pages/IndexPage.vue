<template>
  <div>
    <HeroSection />
    <MarqueeBar />
    <HowSection />
    <CtaFooter />
  </div>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue'

import MarqueeBar from '../components/MarqueeBar.vue'
import HowSection from '../components/HowSection.vue'
import CtaFooter from '../components/CtaFooter.vue'

defineEmits(['toast'])

</script>

