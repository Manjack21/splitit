<template>
    <div class="w3-container w3-border-bottom">
        <I18n :textId="textReceivePay"/>&nbsp; <currency :absolute="true" :value="amount" />&nbsp; <I18n :textId="textFromTo"/>&nbsp; {{receiverName}}
    </div>
</template>

<script>
import Currency from './Currency.vue';
import I18n from './I18n.vue'
export default {
    components: { I18n, Currency },
    name:"ParticipantDeptsLine",
    props: {
        amount: Number,
        receiverName: String
    },
    computed: {
        textReceivePay: function() {
            if(this.amount >= 0) return "receive";
            else return "pay"
        },
        textFromTo: function() {
            if(this.amount >= 0) return "from";
            else return "to"
        }
    }
}
</script>