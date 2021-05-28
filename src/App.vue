<template>
  <div>
    <header class="w3-container w3-grey w3-border w3-border-green w3-bottombar w3-center">
      <h1><img src="split.png" style="width:3rem; heigth:3rem;"> Split It!</h1>
    </header>

    <main id="app" class="w3-container">
      <nav class="w3-container w3-bar">
        <div class="w3-bar-item w3-button w3-green" v-on:click="showModal('newParticipantModal')">
            <img src="user.png" style="height:5rem;"> <i18n textId="addUser" />
        </div>
        <div class="w3-bar-item w3-button w3-green" v-on:click="exportData()">
            <img src="export.png" style="height:5rem;"> <i18n textId="export" />
        </div>
        <div class="w3-bar-item w3-button w3-green" v-on:click="showModal('importModal')">
            <img src="import.png" style="height:5rem;"> <i18n textId="import" />
        </div>
        <div class="w3-bar-item w3-button w3-red" v-on:click="resetData()">
            <img src="delete.png" style="height:5rem;"> <i18n textId="delete" />
        </div>
      </nav>

      <article class="w3-row-padding w3-margin" style="width:100%;">
        <ParticipantCard
          v-for="participant in participants"
          v-bind:key="participant.id"
          :participant="participant"
          :participants="participants"
          :entries="entries"
          v-on:removeParticipant="removeParticipant($event);"
          v-on:addRepayEntry="newEntry.payee = $event.id; newEntry.receiver = -1; newEntry.payeeName = $event.name; showModal('newRepayModal');"
          v-on:addBuyEntry="newEntry.payee = $event.id; newEntry.receiver = -1; newEntry.payeeName = $event.name; newEntry.name = ''; showModal('newBuyModal');"
          />
      </article>
      
      <EntryTable 
        :entries="entries"
        :participants="participants"
        @removeEntry="removeEntry($event)" 
        @updateEntry="saveData()"
        />

    </main>


    <div id="newParticipantModal" class="w3-modal">
      <div class="w3-modal-content w3-padding" style="width:20rem; padding-top:3rem;">
        <span v-on:click="hideModal('newParticipantModal');" class="w3-button w3-display-topright">&times;</span>
        <p>
          <label for="newParticipantName"><i18n text-id="name"/>: </label>
          <input class="w3-input w3-border" v-model="newParticipant.name" name="newParticipantName">
        </p>
        <p>
          <label for="newParticipantFactor"><i18n text-id="factor"/>: </label>
          <input class="w3-input w3-border" v-model.number="newParticipant.factor" name="newParticipantFactor">
        </p>
        <p>
          <button class="w3-btn w3-block w3-green" v-on:click="addParticipant(); hideModal('newParticipantModal');">
            <i18n text-id="addUser"/>
          </button>
        </p>
      </div>
    </div>

    <div id="newBuyModal" class="w3-modal">
      <div class="w3-modal-content w3-padding" style="width:20rem; padding-top:3rem;">
        <span v-on:click="hideModal('newBuyModal');" class="w3-button w3-display-topright">&times;</span>
        <p>
          <label for="newBuyName"><i18n text-id="buyWhat" />: </label>
          <input class="w3-input w3-border" v-model="newEntry.name" name="newBuyName">
        </p>
        <p>
          <label for="newBuyDate"><i18n text-id="buyDate" />: </label>
          <input class="w3-input w3-border" v-model="newEntry.date" type="date" name="newBuyDate">
        </p>
        <p>
          <label for="newBuyAmount"><i18n text-id="buyAmount" />: </label>
          <CurrencyInput v-model="newEntry.amount" />
        </p>
        <p>
          <button class="w3-btn w3-block w3-green" v-on:click="addEntry(); hideModal('newBuyModal');">
            <i18n text-id="buySubmit" />
          </button>
        </p>
      </div>
    </div>
    
    <div id="importModal" class="w3-modal">
      <div class="w3-modal-content w3-padding" style="width:20rem; padding-top:3rem;">
        <span v-on:click="hideModal('importModal');" class="w3-button w3-display-topright">&times;</span>
        <p>
          <label for="importFile"><i18n text-id="loadSaveFile" />: </label>
          <input class="w3-input w3-border" type="file" id="importFile" name="importFile">
        </p>
        <p>
          <button class="w3-btn w3-block w3-green" v-on:click="importData(); hideModal('importModal');">
            <i18n text-id="loadSubmit" />
          </button>
        </p>
      </div>
    </div>


    <div id="newRepayModal" class="w3-modal">
      <div class="w3-modal-content w3-padding" style="width:40rem; padding-top:3rem;">
        <span v-on:click="hideModal('newRepayModal');" class="w3-button w3-display-topright">&times;</span>
        <input v-model="newEntry.name" type="hidden" name="newRepayName">
        <p>
          <label for="newRepayAmount"><i18n text-id="repayAmount" />: </label>
          <CurrencyInput v-model="newEntry.amount" />
        </p>
        <p>
          <label for="newRepayAmount"><i18n text-id="repayDate" />: </label>
          <input class="w3-input" type="date" v-model="newEntry.date" />
        </p>
        <p><i18n text-id="receiver" /> {{receiverName}}</p>
        <div class="w3-cell-row">
          <div
            class="w3-card w3-cell w3-padding w3-margin"
            :class="{'w3-pale-green' : (participant.id == newEntry.receiver)}"
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
            <i18n text-id="repaySubmit" />
          </button>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import ParticipantCard from './components/ParticipantCard.vue'
import CurrencyInput from './components/CurrencyInput.vue'
import EntryTable from './components/EntryTable.vue'
import Participant from './models/Participant'
import Entry from './models/Entry'

export default {
  name: 'App',
  data: function() {
    
    var appdata = {
      newParticipant: new Participant(),
      newEntry: new Entry(),
      participants: [],
      entries: []
    }
    let savedData = JSON.parse(localStorage.getItem('splitItPool'));    
    if(savedData !== null) {
      appdata.participants = savedData.participants.map(p => {
        var participant = new Participant();
        Object.assign(participant, p);
        return participant;
      });
      appdata.entries = savedData.entries.map(e => {
        var entry = new Entry();
        Object.assign(entry, e);
        return entry;
      });
    }

    return appdata;
  },
  components: {
    ParticipantCard,
    CurrencyInput,
    EntryTable
  },
  computed: {
    totalParts() {
      return this.participants.reduce((t,c) => t += c.factor, 0);
    },
    receiverName() {
      const receiver = this.participants
        .find(p => p.id === this.newEntry.receiver)
        ?.name;
      if(receiver === null) return receiver;
      return "";
    }
  },
  methods: {
    addParticipant() {
      const maxId = this.participants.reduce((t, c) => { if(c.id > t) return c.id; else return t}, 0) + 1;
      let p = new Participant(maxId, this.newParticipant.name, this.newParticipant.factor)
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
      this.newEntry.id = eId;
      this.newEntry.version = 0;
      this.entries.push(this.newEntry);

      this.newEntry = new Entry();
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
    saveData(content){
      if(content === undefined) content = JSON.stringify(this.$data);

      localStorage.setItem('splitItPool', content);
    },
    resetData(){
      localStorage.removeItem('splitItPool');
    },
    exportData(){
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.$data)));
      element.setAttribute('download', 'splitit.data.json');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    importData(){
      var fname = document.getElementById("importFile").files[0];
      
      var saveData = this.saveData;
      var reader = new FileReader();
      reader.onload = function(e) {
        var contents = e.target.result;
        saveData(contents);
      };
      reader.readAsText(fname);
      this.hideModal("importModal")
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
