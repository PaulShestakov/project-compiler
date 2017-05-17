import Nonterminal from "./Nonterminal";
import Terminal from "./Terminal";
export default class Rule {
    private lhs;
    private rhs;
    constructor(lhs: Nonterminal, rhs: Array<Terminal | Nonterminal>);
    logRule(): void;
}
