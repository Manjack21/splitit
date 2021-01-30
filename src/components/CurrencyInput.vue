<template>
    <div>
        <select class="w3-input w3-border" @change="emitValue()" v-model="selectedCurrency">
            <option v-for="c in currencies" :key="c.symbol" :value="c">{{c.symbol}}</option>        
        </select>

        <input class="w3-input w3-border" type="tel" v-model="amount" @input="emitValue()">
    </div>
</template>

<script>
export default {
    name:"CurrencyInput",
    data: function() {
        return {
            amount: this.value.toString(),
            selectedCurrency: {
                    symbol: "EUR",
                    factor: 1
                },
            currencies: [
                {
                    symbol: "EUR",
                    factor: 1
                },
                {
                    symbol: "Kuna",
                    factor: 0.1322
                }
            ]
        }
    },
    props: {
        value:{
            type: Number,
            default: 0,
            twoway: true
        }
    },
    methods:{
        emitValue(){
            let result = 0.0;
            if(this.amount.match(/^\d+,\d{0,4}$/g)) result = new Number(this.amount.replace(',', '.'));
            else if(!isNaN(this.amount)) result = new Number(this.amount);

            result = result * this.selectedCurrency.factor;
            this.$emit('input', result);
        }
    }
}
</script>