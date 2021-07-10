<template>    
    <div class="w3-modal" style="display:block">
      <div class="w3-modal-content w3-padding" style="width:20rem; padding-top:3rem;">
        <span v-on:click="close();" class="w3-button w3-display-topright">&times;</span>
        <p>
          <label for="newParticipantName"><i18n text-id="name"/>: </label>
          <input class="w3-input w3-border" v-model="name" name="newParticipantName">
        </p>
        <p>
          <label for="newParticipantFactor"><i18n text-id="factor"/>: </label>
          <input class="w3-input w3-border" v-model.number="factor" name="newParticipantFactor">
        </p>
        <p>
          <button class="w3-btn w3-block w3-green" v-on:click="addParticipant()">
            <i18n text-id="addUser"/>
          </button>
        </p>
      </div>
    </div>
</template>

<script>
import Participant from '../models/Participant';
export default {
    name: "NewParticipantModal",
    data: function() {
        return {
            name: "",
            factor: 1
        };
    },
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    methods: {
        close: function(){
            this.$emit('close');
        },
        addParticipant: function() {
            let value = new Participant(this.id, this.name, this.factor);
            this.$emit("addParticipant", value);
            this.close();
        }
    }
}
</script>