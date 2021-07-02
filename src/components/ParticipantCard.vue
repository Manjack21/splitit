<template>
    <div class="w3-col s12 m4">
        <div class="w3-container w3-display-container w3-border w3-padding">
                <img src="user.png">
            <p>
                <strong>{{participant.name}}</strong> <br/>
                <small><i18n text-id="factor" />: {{participant.factor}} </small> 
            </p>
            <p><currency :value="totalAmount" /></p>
            
            <div class="w3-block w3-button w3-green" v-on:click="$emit('addBuyEntry', participant)">
                <i18n text-id="btnBuy" />
            </div>
            <div class="w3-block w3-button w3-green" v-on:click="$emit('addRepayEntry', participant)">
                <i18n text-id="btnRepay" />
            </div>
            <div class="w3-block w3-button w3-green" v-on:click="toggleDetails()">
                <i18n text-id="btnDepts" />
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
import I18n from './I18n.vue';

export default {
  components: { Currency, I18n },
    name:"ParticipantCard",
    data: function() {
        return {
            showParticipantEntries: false
        }
    },
    props: {
        participants: undefined,
        participant: undefined,
        entries: undefined
    },
    computed: {
        totalAmount: function() {            
            const pos = this.entries
                .reduce((t, c) => {
                    console.log("prev", this.participant.name , {from: c.payee, to: c.receiver, amount: c.amount}, t);
                    t += c.totalAmount(this.participant.id, this.participant.factor, this.totalParts(c.excludes));
                    console.log("after", this.participant.name, t);
                    return t;
                    }, 
                    0
                );
            
            return pos;
        }
    },
    methods: {
        totalParts(excludes)
        {
            return this.participants
                .filter(p => excludes === undefined || excludes.indexOf(p.id) == -1)
                .reduce((t, p) => t += p.factor, 0);
        },
        getParticipantDepts(otherPart){
            const pos = this.entries
                .filter(e => 
                    e.payee == this.participant.id & e.excludes.indexOf(otherPart.id) == -1)
                .reduce((t, c) => {
                    if(c.receiver == otherPart.id)
                        return t += c.amount
                    else if(c.receiver == -1)
                        return t += (c.amount * otherPart.factor / this.totalParts(c.excludes));
                    else
                        return t;
                },
                0);

            const neg = this.entries
                .filter(e => e.payee == otherPart.id & e.excludes.indexOf(this.participant.id) == -1)
                .reduce((t, c) => { 
                    if(c.receiver == this.participant.id)
                        return t + c.amount
                    else if(c.receiver == -1)
                        return t + (c.amount * this.participant.factor / this.totalParts(c.excludes))
                    else
                        return t;
                    },
                    0);
            console.log(pos, neg, this.entries);

            return neg - pos;
        },
        toggleDetails(){
            if(this.showParticipantEntries) this.showParticipantEntries = false;
            else this.showParticipantEntries = true;
        }
    }
}
</script>