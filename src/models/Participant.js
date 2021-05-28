
export default class Participant
{
    constructor(id, name, factor)
    {
        this.id = id;
        this.name = name;
        this.factor = (factor === undefined ? 1 : factor);
    }
}