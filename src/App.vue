<template>
  <div>
    <header class="w3-container w3-grey w3-border w3-border-green w3-bottombar w3-center">
      <h1><img src="split.png" style="width:3rem; heigth:3rem;"> Split It!</h1>
    </header>

    <main id="app" class="w3-container">
      <nav class="w3-container w3-bar">
        <div class="w3-bar-item w3-button w3-green" v-on:click="showModal('newParticipantModal')">
            <img src="user.png" style="height:5rem;"> Add User
        </div>
        <div class="w3-bar-item w3-button w3-red" v-on:click="resetData()">
            <img src="delete.png" style="height:5rem;"> Clear Data
        </div>
      </nav>

      <article class="w3-row-padding w3-margin" style="width:100%;">
        <Participant
          v-for="participant in participants"
          v-bind:key="participant.id"
          :participant="participant"
          :participants="participants"
          :entries="entries"
          :totalParts="totalParts"
          v-on:removeParticipant="removeParticipant($event);"
          v-on:addRepayEntry="newEntry.payee = $event.id; newEntry.receiver = -1; newEntry.payeeName = $event.name; showModal('newRepayModal');"
          v-on:addBuyEntry="newEntry.payee = $event.id; newEntry.receiver = -1; newEntry.payeeName = $event.name; newEntry.name = ''; showModal('newBuyModal');"
          />
      </article>
      
      <EntryTable 
        :entries="entries"
        v-on:removeEntry="removeEntry($event)" 
        />

    </main>


    <div id="newParticipantModal" class="w3-modal">
      <div class="w3-modal-content w3-padding" style="width:20rem; padding-top:3rem;">
        <span v-on:click="hideModal('newParticipantModal');" class="w3-button w3-display-topright">&times;</span>
        <p>
          <label for="newParticipantName">Name: </label>
          <input class="w3-input w3-border" v-model="newParticipant.name" name="newParticipantName">
        </p>
        <p>
          <label for="newParticipantFactor">Factor [aka. people count]: </label>
          <input class="w3-input w3-border" v-model.number="newParticipant.factor" name="newParticipantFactor">
        </p>
        <p>
          <button class="w3-btn w3-block w3-green" v-on:click="addParticipant(); hideModal('newParticipantModal');">
            Add User
          </button>
        </p>
      </div>
    </div>

    <div id="newBuyModal" class="w3-modal">
      <div class="w3-modal-content w3-padding" style="width:20rem; padding-top:3rem;">
        <span v-on:click="hideModal('newBuyModal');" class="w3-button w3-display-topright">&times;</span>
        <p>
          <label for="newBuyName">What &amp; where: </label>
          <input class="w3-input w3-border" v-model="newEntry.name" name="newBuyName">
        </p>
        <p>
          <label for="newBuyDate">Purchase date: </label>
          <input class="w3-input w3-border" v-model="newEntry.date" type="date" name="newBuyDate">
        </p>
        <p>
          <label for="newBuyAmount">Total amount: </label>
          <CurrencyInput v-model="newEntry.amount" />
        </p>
        <p>
          <button class="w3-btn w3-block w3-green" v-on:click="addEntry(); hideModal('newBuyModal');">
            Yes, i've buyed that!
          </button>
        </p>
      </div>
    </div>


    <div id="newRepayModal" class="w3-modal">
      <div class="w3-modal-content w3-padding" style="width:40rem; padding-top:3rem;">
        <span v-on:click="hideModal('newRepayModal');" class="w3-button w3-display-topright">&times;</span>
        <input v-model="newEntry.name" type="hidden" name="newRepayName">
        <p>
          <label for="newRepayAmount">Total amount: </label>
          <CurrencyInput v-model="newEntry.amount" />
        </p>
        <p>
          <label for="newRepayAmount">Repay date: </label>
          <input class="w3-input" type="date" v-model="newEntry.date" />
        </p>
        <p>Receiver {{receiverName}}</p>
        <div class="w3-cell-row">
          <div
            class="w3-card w3-cell w3-padding w3-margin"
            v-for="participant in participants.filter(p => p.id !== newEntry.payee)"
            :key="participant.id"
            @click="newEntry.receiver = participant.id; newEntry.name = `Payment from ${newEntry.payeeName} to ${participant.name}`;"
            >
            <img src="user.png" style="width:5rem;">
            {{participant.name}}
          </div>
        </div>
        <p>
          <button class="w3-btn w3-block w3-green" v-on:click="addEntry(); hideModal('newRepayModal');">
            Have your money
          </button>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import Participant from './components/Participant.vue'
import CurrencyInput from './components/CurrencyInput.vue'
import EntryTable from './components/EntryTable.vue'

export default {
  name: 'App',
  data: function() {
    let savedData = JSON.parse(localStorage.getItem('splitItPool'));
    if(savedData === null){
      savedData = {
        newParticipant: {
          name: "",
          factor: 1
        },
        newEntry: {
          name: "",
          amount: 0,
          payee: -1,
          date: (new Date()).toISOString().substring(0, 10),
          receiver: -1
        },
        participants: [],
        entries: []
      }
    }
    return savedData;
  },
  components: {
    Participant,
    CurrencyInput,
    EntryTable
  },
  computed: {
    totalParts() {
      return this.participants.reduce((t,c) => t += c.factor, 0);
    },
    receiverName() {
      const receiver = this.participants
        .filter(p => p.id === this.newEntry.receiver)
        .map(p => p.name);
      if(receiver.length > 0) return receiver[0];
      return "";
    }
  },
  methods: {
    addParticipant() {
      const p = JSON.parse(JSON.stringify(this.newParticipant));
      p.id = this.participants.reduce((t, c) => { if(c.id > t) return c.id; else return t}, 0) + 1;
      this.participants.push(p);
      this.saveData();
    },
    removeParticipant(participant) {
      let pEntries = this.entries
        .filter(e => e.payee == participant.id)
        .map(e => this.entries.indexOf(e));
      pEntries.sort((a,b) => b - a)

      pEntries.forEach(eIdx => {
        this.entries.splice(eIdx, 1)
      });

      const pIdx = this.participants.indexOf(participant)
      this.participants.splice(pIdx, 1);
      this.saveData();
    },
    addEntry() {
      const eId = this.entries.reduce((t, c) => { if(c.id > t) return c.id; else return t}, 0) + 1;
      let nEntry = JSON.parse(JSON.stringify(this.newEntry));
      nEntry.id = eId;

      this.entries.push(nEntry);
      this.saveData();
    },
    removeEntry(entry) {
      const eIdx = this.entries.indexOf(entry);      
      this.entries.splice(eIdx, 1);
      this.saveData();
    },
    hideModal(name) {
      document.getElementById(name).style.display = "none"
    },
    showModal(name) {
      document.getElementById(name).style.display = "block"
    },
    saveData(){
      localStorage.setItem('splitItPool', JSON.stringify(this.$data));
    },
    resetData(){
      localStorage.removeItem('splitItPool');
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
