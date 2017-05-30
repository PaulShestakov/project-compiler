import NonTerminal from "./NonTerminal";
import Terminal from "./Terminal";

const EMPTY_TERMINAL = new Terminal('E');

export default class Rule {
	public lhs: NonTerminal;
	public rhs: Array<Terminal | NonTerminal>;

	public semanticRule;

	constructor(lhs: NonTerminal, rhs: Array<Terminal | NonTerminal>, semanticRule?) {
		this.lhs = lhs;
		this.rhs = rhs;
		this.semanticRule = semanticRule;
	}

	logRule() {
		console.log(this.lhs + ' -> ' + this.rhs.join(' '));
	}

	isEmptyRule(): boolean {
		return this.rhs.length === 1 &&
			this.rhs[0].equals(EMPTY_TERMINAL);
	}

	equals(rule: Rule): boolean {
		return this.lhs.equals(rule.lhs)
			&& this.rhs.length === rule.rhs.length
			&& this.rhs.every((elem, index) => {
				return elem.equals(rule.rhs[index]);
			});
	}
}