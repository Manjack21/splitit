
<template>
    <span>{{text}}</span>
</template>

<script>
export default {
    name: 'I18n',
    data: function(){
        return {
            text: ""
        }
    },
    props: {
        textId : String
    },
    created() {
        this.$lang.text().then(data => this.text = data[this.textId]);
    }
}
</script>