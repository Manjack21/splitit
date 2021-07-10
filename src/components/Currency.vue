<template>
    <span :class="{'w3-text-red': (value < 0 & colored), 'w3-text-green': (value >= 0 & colored)}">{{formatedAmount}}&nbsp;{{currency.symbol}}</span>
</template>

<script>
export default {
    name: "Currency",
    props: {
        value: Number,
        absolute: Boolean,
        colored: {
            type: Boolean,
            default: true
        },
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
            let result = this.value;
            if(this.absolute) result = Math.abs(result);
            return result.toFixed(2).toLocaleString(this.locale);
        }
    }
}
</script>