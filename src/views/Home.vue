<template>
  <div class="home">
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
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AccountHttp, Address } from 'nem-library';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  private address: string = '';

  public async getAccount() {
    const accountHttp = new AccountHttp();
    accountHttp.getFromAddress(new Address(this.address)).subscribe(accountInfoWithMetaData => {
      const balance = accountInfoWithMetaData.balance.balance / 1000;
      console.log(balance);
    });
  }
}
</script>
