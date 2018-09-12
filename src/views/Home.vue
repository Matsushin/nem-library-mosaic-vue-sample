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
      <v-text-field 
        label="送金先アドレス"
        v-model="toAddress"
        :counter="40"
        arequired
        placeholder="例. NBHWRG6STRXL2FGLEEB2UOUCBAQ27OSGDTO44UFC"
      ></v-text-field>
      <v-text-field 
        label="秘密鍵"
        v-model="privateKey"
        :counter="64"
        arequired
      ></v-text-field>
      <v-text-field 
        label="モザイク"
        v-model="mosaicName"
        arequired
        placeholder="matsushin:coin"
      ></v-text-field>
      <v-text-field 
        label="送金量"
        v-model="amount"
        arequired
      ></v-text-field>
      <v-flex>
        <v-btn color="blue" class="white-text" @click="sendMosaic()">モザイクを送金する</v-btn>
      </v-flex>
      <div v-if="message != ''">
        <v-alert
          :value="true"
          type="success"
        >
          成功：{{message}}
        </v-alert>
      </div>
      <div v-if="error != ''">
        <v-alert
          :value="true"
          type="error"
        >
          失敗：{{error}}
        </v-alert>
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
    ...mapGetters({ mosaicList: 'mosaic/mosaicList', error: 'mosaic/error', message: 'mosaic/message' })
  },
})
export default class Home extends Vue {
  private address: string = '';
  private toAddress: string = '';
  private privateKey: string = '';
  private mosaicName: string = '';
  private amount: number = 0;

  public async getAccount() {
    await this.$store.dispatch('mosaic/getMosaics', this.address);
  }

  public async sendMosaic() {
    const payload = {
      toAddress: this.toAddress,
      privateKey: this.privateKey,
      mosaicName: this.mosaicName,
      amount: this.amount
    }
    await this.$store.dispatch('mosaic/sendMosaic', payload);
  }
}
</script>
