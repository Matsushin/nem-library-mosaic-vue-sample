<template>
  <div class="mosaic">
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
        <v-btn color="blue" class="white-text" @click="getMosaics()">アカウント情報を取得する</v-btn>
      </v-flex>
    </div>
    <div v-else>
      <h2 class="mb-2">保有モザイク一覧</h2>
      <v-data-table
        :headers="headers"
        :items="mosaicList"
        hide-actions
        class="mosaic"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.balance }}</td>
        </template>
      </v-data-table>
      <h2 class="mt-5">モザイク送金</h2>
      <div v-for="(item, index) in validation" :key="index" class="errorLabel">
        <div v-if="item!==true" class="red--text">{{ item }}</div>
      </div>
      <v-text-field 
        label="送金先アドレス"
        v-model="toAddress"
        :counter="40"
        arequired
        placeholder="例. TAPGZUNJV6MGRPR5J4MXBT5HIRM5ZK5E2FHXXSJA"
      ></v-text-field>
      <v-text-field 
        label="あなたの秘密鍵"
        v-model="privateKey"
        :counter="64"
        arequired
        placeholder="例. 9b42fb53b19b9794a55b0b878b170beec3d773f21b9aac7d9fd671971ee9b546"
      ></v-text-field>
      <v-flex xs6 sm4>
        <v-text-field 
          label="ネームスペース・モザイク名"
          v-model="mosaicName"
          arequired
          placeholder="例. matsushin:coin"
        ></v-text-field>
      </v-flex>
      <v-flex xs6 sm1>
        <v-text-field 
          label="送金量"
          v-model="amount"
          type="number"
          arequired
        ></v-text-field>
      </v-flex>
      <v-flex>
        <v-btn color="blue" class="white-text" @click="sendMosaic()">モザイクを送金する</v-btn>
      </v-flex>
      <h2 class="mt-5">送金結果</h2>
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
import { mapGetters } from 'vuex';

@Component({
  data: () => ({
    headers: [
      {
        text: 'モザイク',
        align: 'left',
        sortable: false,
        value: 'name',
      },
      { text: '残高', value: 'balance' },
    ],
    rules: {
      toAddrLimit: (value: string) => (value && (value.length === 46 || value.length === 40)) || '送金先アドレス(-除く)は40文字です。',
      toAddrInput: (value: string) => {
        const pattern = /^[a-zA-Z0-9-]+$/;
        return pattern.test(value) || '送金先の入力が不正です';
      },
      privateKeyLimit: (value: string) => (value && (value.length === 64)) || '秘密鍵は64文字です。',
      privateKeyInput: (value: string) => {
        const pattern = /^[a-zA-Z0-9-]+$/;
        return pattern.test(value) || '秘密鍵の入力が不正です';
      },
      mosaicNameInput: (value: string) => {
        const pattern = /^[a-zA-Z0-9-:]+$/;
        return pattern.test(value) || 'ネームスペース・モザイク名の入力が不正です';
      },
      amountLimit: (value: number) => (value >= 0) || '数量を入力してください',
      amountInput: (value: string) => {
        const pattern = /^[0-9.]+$/; // ※ブログ上ではちゃんと表示されないため、実装の際はこのコメントアウトを外してください
        return (pattern.test(value) && !isNaN(Number(value))) || '数量の入力が不正です';
      },
    },
  }),
  computed: {
    ...mapGetters({ mosaicList: 'mosaic/mosaicList', error: 'mosaic/error', message: 'mosaic/message' }),
  },
})
export default class Mosaic extends Vue {
  private address: string = '';
  private toAddress: string = '';
  private privateKey: string = '';
  private mosaicName: string = '';
  private amount: number = 0;
  private validation: any[] = [];

  private async getMosaics() {
    await this.$store.dispatch('mosaic/getMosaics', this.address);
  }

  private async sendMosaic() {
    if (this.isValidation() === true) {
        const payload = {
            toAddress: this.toAddress,
            privateKey: this.privateKey,
            mosaicName: this.mosaicName,
            amount: this.amount,
        };
        await this.$store.dispatch('mosaic/sendMosaic', payload);
    }
  }

  private isValidation(): boolean {
    this.validation = [];
    this.validation.push(this.$data.rules.toAddrLimit(this.toAddress));
    this.validation.push(this.$data.rules.toAddrInput(this.toAddress));
    this.validation.push(this.$data.rules.privateKeyLimit(this.privateKey));
    this.validation.push(this.$data.rules.privateKeyInput(this.privateKey));
    this.validation.push(this.$data.rules.mosaicNameInput(this.mosaicName));
    this.validation.push(this.$data.rules.amountLimit(this.amount));
    this.validation.push(this.$data.rules.amountInput(this.amount));
    let isError: boolean = false;
    this.validation.forEach((obj: any) => {
      if (obj !== true) { isError = true; }
    });
    return !isError;
  }
}
</script>
