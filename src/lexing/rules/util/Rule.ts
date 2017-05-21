import NonTerminal from "./NonTerminal";
import Terminal from "./Terminal";


export default class Rule {
	public lhs: NonTerminal;
	public rhs: Array<Terminal | NonTerminal>;

	constructor(lhs: NonTerminal, rhs: Array<Terminal | NonTerminal>) {
		this.lhs = lhs;
		this.rhs = rhs;
	}

	logRule() {
		console.log(this.lhs + ' -> ' + this.rhs.join(' '));
	}

	equals(rule: Rule): boolean {
		return this.lhs.equals(rule.lhs)
			&& this.rhs.length === rule.rhs.length
			&& this.rhs.every((elem, index) => {
				return elem.equals(rule.rhs[index]);
			});
	}
}