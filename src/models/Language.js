
export default class Language
{
    constructor(lang = "en"){
        this.loadPromise = fetch(`lang/${lang}.json`)
            .then(response => response.json())
            .then(data => this.texts = data);
    }
    
    text(){
        return this.loadPromise;
    }

    async translate(textId) {
        let texts = await this.text();
        return texts[textId]
    }
    
}