
<template>
    <div class="w3-modal" style="display:block;">
      <div class="w3-modal-content w3-padding" style="width:20rem; padding-top:3rem;">

        <span @click="close();" class="w3-button w3-display-topright">&times;</span>

        <p>
          <label for="newBuyName"><i18n text-id="buyWhat" />: </label>
          <input class="w3-input w3-border" v-model="name" name="newBuyName">
        </p>

        <p>
          <label for="newBuyDate"><i18n text-id="buyDate" />: </label>
          <input class="w3-input w3-border" v-model="date" type="date" name="newBuyDate">
        </p>

        <p>
          <label for="newBuyAmount"><i18n text-id="buyAmount" />: </label>
          <currency-input v-model="amount" />
        </p>

        <p>
          <button class="w3-btn w3-block w3-green" @click="addEntry()">
            <i18n text-id="buySubmit" />
          </button>
        </p>
      </div>
    </div>
</template>

<script>
import Entry from '../models/Entry';
import CurrencyInput from './CurrencyInput.vue';
export default {
  components: { CurrencyInput },
    name: "NewBuyModal",
    data: function() {
        return {
            name: "",
            date: (new Date()).toISOString().substring(0, 10),
            amount: 0.0
        }
    },
    props: {
        id: {
            type: Number,
            require: true
        },
        payeeId: {
            type: Number,
            require: true
        }
    },
    methods: {
        close: function() {
            this.$emit('close');
        },
        addEntry: function() {
            let value = new Entry();
            value.id = this.id;
            value.name = this.name;
            value.amount = this.amount;
            value.payee = this.payeeId;
            value.date = this.date;
            value.receiver = -1;
            value.version = 0;

            this.$emit('addEntry', value);
            this.close();
        }
    }


}
</script>