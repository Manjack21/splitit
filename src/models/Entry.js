
export default class Entry
{
    constructor(name)
    {
        this.name = name;
        this.amount = 0;
        this.excludes = [];
        this.payee = -1;
        this.date = (new Date()).toISOString().substring(0, 10);
        this.receiver = -1;
        this.version = 0;
    }

    key() { return this.id + '_' + this.version; }
    newVersion(){ this.version++; }

    totalAmount(participantId, participantFactor, totalParts) {
        // payed something for group
        if(this.payee == participantId & this.receiver == -1) 
            return this.amount - (this.amount / totalParts * participantFactor);

        // repayed to another member
        if(this.payee == participantId & this.receiver != -1)
                return this.amount;
        
        // received money from another member
        else if(this.receiver == participantId) 
            return this.amount * -1;
        
        // someone payed for the group
        else if(this.receiver == -1 & this.excludes.indexOf(participantId) == -1) 
            return (this.amount / totalParts * participantFactor) * -1;
        
        // undefined behaviour
        else
            return 0;
    }
}