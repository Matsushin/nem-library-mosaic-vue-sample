<template>
  <div class="home">
    <Mosaic />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Mosaic from '@/components/Mosaic.vue'; 

@Component({
  components: {
    Mosaic,
  },
})
export default class Home extends Vue {

}
</script>
