export default class NonTerminal {
    private name;
    constructor(name: string);
    getName(): string;
    toString(): string;
    equals(nonterm: any): boolean;
}
