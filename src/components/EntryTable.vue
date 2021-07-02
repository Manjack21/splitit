
<template>
    <div>
        <h2>Saved Entries</h2>
        <div class="w3-row w3-border-bottom">
            <div class="w3-col s1 w3-center">&darr;</div>
            <div class="w3-col m2 w3-hide-small w3-center"><strong><i18n text-id="date" /></strong></div>
            <div class="w3-col m6 s8 w3-center"><strong><i18n text-id="description" /></strong></div>
            <div class="w3-col s3 w3-right-align"><strong><i18n text-id="amount" /></strong></div>
        </div>
        <div class="w3-border-bottom" v-for="entry in entries" :key="entry.key()">
            <div class="w3-row-padding">
                <div class="w3-col s1">
                    <span class="w3-button w3-hover-red" @click="$emit('removeEntry', entry)">&times;</span>
                </div>
                <div class="w3-col m2 w3-hide-small">
                    {{entry.date}}
                </div>
                <div class="w3-col m6 s8">
                    {{getParticipant(entry.payee).name}} - {{entry.name}}
                </div>
                <div class="w3-col s3 w3-right-align">
                    <currency :value="entry.amount" />
                </div>
            </div>
            <div class="w3-row-padding">
                <div class="w3-col s12">
                    <span class="w3-btn w3-round w3-margin" 
                        :class="{ 'w3-pale-green' : !isExcluded(entry, p), 'w3-light-grey' : isExcluded(entry, p) }"
                        v-for="p in participants.filter(p=>entry.payee != p.id & entry.receiver == -1)" :key="p.id"
                        @click="toggleExclude(entry, p)"
                        >
                        {{p.name}} <span class="w3-border w3-round w3-small">
                            <currency :value="participantAmount(getParticipant(entry.payee), entry)" />
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Currency from './Currency.vue';

export default {
    name: "EntryTable",
    props: {
        entries: undefined,
        participants: undefined
    },
    components:{
        Currency
    },
    methods: {
        participantAmount: function(p, e){
            return e.totalAmount(p.id, p.factor, this.totalParts(e.excludes));
        },
        getParticipant(id){
            return this.participants.find(p => p.id == id);
        },
        isExcluded(entry, participant) {
            if(entry.excludes === undefined) return false;
            return (entry.excludes.indexOf(participant.id) > -1);
        },
        toggleExclude(entry, participant)
        {
            if(entry.excludes === undefined) entry.excludes = [];
             
            const pIdx = entry.excludes.indexOf(participant.id);

            if(pIdx > -1)
            {
                entry.excludes.splice(pIdx, 1);                
            }
            else
            {
                entry.excludes.push(participant.id);
            }
            entry.newVersion();
            this.$emit("updateEntry", entry, participant)
        },
        formatAmount(amount) {
            return amount.toFixed(2).toLocaleString("de-DE");
        },
        totalParts(excludes)
        {
            return this.participants
                .filter(p => excludes === undefined || excludes.indexOf(p.id) == -1)
                .reduce((t, p) => t += p.factor, 0);
        }
    }
}
</script>