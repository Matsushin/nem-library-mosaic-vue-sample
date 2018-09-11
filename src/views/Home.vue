<template>
  <div class="home">
    <div v-if="mosaicList.length <= 0">
      <h2>アカウント情報の取得</h2>
      <v-text-field 
        label="アドレス"
        v-model="address"
        :counter="40"
        arequired
        placeholder="例. NBHWRG6STRXL2FGLEEB2UOUCBAQ27OSGDTO44UFC"
      ></v-text-field>
      <v-flex>
        <v-btn color="blue" class="white-text" @click="getAccount()">アカウント情報を取得する</v-btn>
      </v-flex>
    </div>
    <div v-else>
      <h2>モザイク一覧</h2>
      <div v-for="(item, index) in mosaicList" :key="index">
          <div>{{ item.mosaicId.namespaceId }}:{{ item.mosaicId.name }} {{ item.amount }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex'
import { AccountHttp, Address, AccountOwnedMosaicsService, MosaicHttp } from 'nem-library';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
  computed: {
    ...mapGetters({ mosaicList: 'mosaic/mosaicList' })
  },
})
export default class Home extends Vue {
  private address: string = '';

  public async getAccount() {
    await this.$store.dispatch('mosaic/getMosaics', this.address);
  }
}
</script>
