import NonTerminal from "./NonTerminal";
import Terminal from "./Terminal";
export default class Rule {
    lhs: NonTerminal;
    rhs: Array<Terminal | NonTerminal>;
    constructor(lhs: NonTerminal, rhs: Array<Terminal | NonTerminal>);
    logRule(): void;
    equals(rule: Rule): boolean;
}
