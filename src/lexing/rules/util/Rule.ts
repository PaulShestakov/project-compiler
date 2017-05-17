
import Nonterminal from "./Nonterminal";
import Terminal from "./Terminal";


export default class Rule {
	private lhs: Nonterminal;
	private rhs: Array<Terminal | Nonterminal>;

	constructor(lhs: Nonterminal, rhs: Array<Terminal | Nonterminal>) {
		this.lhs = lhs;
		this.rhs = rhs;
	}

	logRule() {
		console.log(this.lhs + ' -> ' + this.rhs.join(' '));
	}

}