import Terminal from "./util/Terminal";
import Rule from "./util/Rule";
import NonTerminal from "./util/NonTerminal";
export default class RulesParser {
    static getRules(fileName: any): any;
    static getGrammarSymbols(rules: Rule[]): (NonTerminal | Terminal)[];
}
