<template>
    <div class="w3-col s6 m3">
        <div class="w3-container w3-display-container w3-border w3-padding">
                <img src="user.png">
            <p><strong>{{participant.name}}</strong></p>
            <p><currency :value="totalAmount" /></p>
            
            <div class="w3-block w3-button w3-green" v-on:click="$emit('addBuyEntry', participant)">
                I've buyed something
            </div>
            <div class="w3-block w3-button w3-green" v-on:click="$emit('addRepayEntry', participant)">
                I repayed some money
            </div>
            <div class="w3-block w3-button w3-green" v-on:click="toggleDetails()">
                Show my depts
            </div>

            <span class="w3-button w3-display-topright w3-xlarge" @click="$emit('removeParticipant', participant)">
                &times;
            </span>
            
            <div v-if="showParticipantEntries" class="w3-container w3-border">
                <div v-for="p in participants.filter(p => p.id != participant.id)" :key="p.id">
                    <currency :value="getParticipantDepts(p)" /> to {{p.name}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Currency from './Currency.vue';

export default {
  components: { Currency },
    name:"Participant",
    data: function() {
        return {
            showParticipantEntries: false
        }
    },
    props: {
        participants: undefined,
        participant: undefined,
        entries: undefined,
        totalParts: Number
    },
    computed: {
        totalAmount: function() {
            const pos = this.entries
                .filter(e => e.payee == this.participant.id)
                .reduce((t, c) => t += c.amount, 0);
            const neg = this.entries
                .filter(e => e.receiver == -1 | e.receiver == this.participant.id)
                .reduce((t, c) => { 
                    if(c.receiver == this.participant.id)
                        return t + c.amount
                    else
                        return t + (c.amount / this.totalParts * this.participant.factor)
                    },
                    0);

            return pos - neg;
        }
    },
    methods: {
        getParticipantDepts(otherPart){
            const pos = this.entries
                .filter(e => e.payee == this.participant.id)
                .reduce((t, c) => {
                    if(c.receiver == otherPart.id)
                        return t += c.amount
                    else if(c.receiver == -1)
                        return t += (c.amount * otherPart.factor / this.totalParts);
                    else
                        return t;
                },
                0);          

            const neg = this.entries
                .filter(e => e.payee == otherPart.id)
                .reduce((t, c) => { 
                    if(c.receiver == this.participant.id)
                        return t + c.amount
                    else if(c.receiver == -1)
                        return t + (c.amount * this.participant.factor / this.totalParts)
                    else
                        return t;
                    },
                    0);

            return neg - pos;
        },
        toggleDetails(){
            if(this.showParticipantEntries) this.showParticipantEntries = false;
            else this.showParticipantEntries = true;
        }
    }
}
</script>