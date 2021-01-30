<template>
    <span>{{formatedAmount}} {{currency.symbol}}</span>
</template>

<script>
export default {
    name: "Currency",
    props: {
        value: Number,
        locale: {
            type: String,
            default: function() {
                return "de-DE";
            }
        },
        currency:{
            type: Object,
            default: function() {
                return {
                    symbol: "EUR",
                    factor: 1
                };
            }
        } 
    },
    computed: {        
        formatedAmount() {
            return this.value.toFixed(2).toLocaleString(this.locale);
        }
    }
}
</script>