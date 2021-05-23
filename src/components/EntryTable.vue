
<template>
    <div>
        <h2>Saved Entries</h2>
        <div class="w3-row w3-border-bottom">
            <div class="w3-col s1 w3-center">&darr;</div>
            <div class="w3-col m2 w3-hide-small w3-center"><strong>Date</strong></div>
            <div class="w3-col m6 s8 w3-center"><strong>Description</strong></div>
            <div class="w3-col s3 w3-center"><strong>Amount</strong></div>
        </div>
        <div class="w3-row-padding w3-border-bottom" v-for="entry in entries" :key="entry.id">
            <div class="w3-col s1">
                <span class="w3-button w3-hover-red" @click="$emit('removeEntry', entry)">&times;</span>
            </div>
            <div class="w3-col m2 w3-hide-small">
                {{entry.date}}
            </div>
            <div class="w3-col m6 s8">
                {{entry.name}}
            </div>
            <div class="w3-col s3 w3-right-align">
                <currency :value="entry.amount" />
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
        formatAmount(amount) {
            return amount.toFixed(2).toLocaleString("de-DE");
        }
    }
}
</script>