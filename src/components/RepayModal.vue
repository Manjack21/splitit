
<template>
    <div id="newRepayModal" class="w3-modal" style="display:block;">
      <div class="w3-modal-content w3-padding" style="width:40rem; padding-top:3rem;">
        <span @click="close()" class="w3-button w3-display-topright">&times;</span>
        <p>
          <label for="newRepayAmount"><i18n text-id="repayAmount" />: </label>
          <currency-input v-model="amount"/>
        </p>
        <p>
          <label for="newRepayDate"><i18n text-id="repayDate" />: </label>
          <input class="w3-input" type="date" name="newRepayDate" v-model="date" />
        </p>
        <p><i18n text-id="receiver" /> {{receiverName}}</p>
        <div class="w3-cell-row">
          <div
            class="w3-card w3-cell w3-padding w3-margin"
            :class="{'w3-pale-green' : (participant.id == receiverId)}"
            v-for="participant in participants.filter(p => p.id !== payeeId)"
            :key="participant.id"
            @click="selectReceiver(participant)"
            >
            <img src="user.png" style="width:5rem;">
            {{participant.name}}
          </div>
        </div>        
        <p>
          <label for="newRepayDescription"><i18n text-id="description" />: </label>
          <input class="w3-input" type="text" name="newRepayDescription" v-model="name" />
        </p>
        <p>
          <button class="w3-btn w3-block w3-green" v-on:click="addEntry();">
            <i18n text-id="repaySubmit" />
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
    name: "RepayModal",
    data: function() {
        return {
            receiver: undefined,
            name: "",
            date: (new Date()).toISOString().substring(0, 10),
            amount: 0.0
        }
    },
    props: {
        participants: {
            type: Array,
            require: true
        },
        id: {
            type: Number,
            require: true
        },
        payeeId: {
            type: Number,
            require: true
        }
    },
    computed: {
        payee: function() {
            return this.participants.filter(p => p.id == this.payeeId)[0];
        },
        receiverName: function() {
            if(this.receiver === undefined) return "";
            return this.receiver.name;
        },
        receiverId: function() {
            if(this.receiver === undefined) return -1;
            return this.receiver.id;
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
            value.receiver = this.receiverId;
            value.version = 0;

            this.$emit('addEntry', value);
            this.close();
        },
        selectReceiver: async function(receiver){
            this.receiver = receiver; 
            let descriptionText = await this.$lang.translate('repayTemplate');
            this.name = descriptionText.replace('{payee}', this.payee.name).replace('{receiver}', receiver.name);
        }
    }


}
</script>