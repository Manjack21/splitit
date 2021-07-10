<template>
  <div>
    <header class="w3-container w3-grey w3-border w3-border-green w3-bottombar w3-center">
      <h1><img src="split.png" style="width:3rem; heigth:3rem;"> Split It!</h1>
    </header>

    <main id="app" class="w3-container">
      <nav class="w3-container w3-bar">
        <div class="w3-bar-item w3-button w3-green" v-on:click="showNewParticipantModal = true">
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
          v-on:addRepayEntry="currentParticipant = $event.id; showRepayModal = true;"
          v-on:addBuyEntry="currentParticipant = $event.id; showNewBuyModal = true;"
          />
      </article>
      
      <EntryTable 
        :entries="entries"
        :participants="participants"
        @removeEntry="removeEntry($event)" 
        @updateEntry="saveData()"
        />

    </main>

    <new-participant-modal 
      v-if="showNewParticipantModal" 
      :id="nextParticipantId"
      @close="showNewParticipantModal = false"
      @addParticipant="addParticipant($event)" />

    <new-buy-modal 
      v-if="showNewBuyModal" 
      :id="nextEntryId"
      :payeeId="currentParticipant"
      @addEntry="addEntry($event)"
      @close="showNewBuyModal = false"
      />

    <repay-modal     
      v-if="showRepayModal" 
      :id="nextEntryId"
      :payeeId="currentParticipant"
      :participants="participants"
      @addEntry="addEntry($event)"
      @close="showRepayModal = false"
    />
    
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


    

  </div>
</template>

<script>
import ParticipantCard from './components/ParticipantCard.vue'
import EntryTable from './components/EntryTable.vue'
import Participant from './models/Participant'
import Entry from './models/Entry'
import NewParticipantModal from './components/NewParticipantModal.vue'
import NewBuyModal from './components/NewBuyModal.vue'
import RepayModal from './components/RepayModal.vue'

export default {
  name: 'App',
  data: function() {
    
    var appdata = {
      currentParticipant: undefined,
      participants: [],
      entries: [],
      showNewParticipantModal: false,
      showNewBuyModal: false,
      showRepayModal: false
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
    EntryTable,
    NewParticipantModal,
    NewBuyModal,
    RepayModal
  },
  computed: {
    totalParts() {
      return this.participants.reduce((t,c) => t += c.factor, 0);
    },
    nextParticipantId() {
      return this.participants.reduce((t, c) => { if(c.id > t) return c.id; else return t}, 0) + 1;
    },
    nextEntryId() {
      return this.entries.reduce((t, c) => { if(c.id > t) return c.id; else return t}, 0) + 1;
    }
  },
  methods: {
    addParticipant(participant) {
      this.participants.push(participant);
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
    addEntry(entry) {
      this.entries.push(entry);
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
      window.location.reload();
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
