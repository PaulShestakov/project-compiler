import Condition from "./Condition";
import Token from "../../lexing/util/Token";


export default class Configuration {
	private stack: Condition[];
	private tokens: Token[];

	constructor(stack: Condition[], tokens: Token[]) {
		this.stack = stack;
		this.tokens = tokens;
	}

	getStack() {
		return this.stack;
	}

	getTokens() {
		return this.tokens;
	}
}