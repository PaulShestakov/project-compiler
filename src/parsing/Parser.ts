import NonTerminal from "../lexing/rules/util/NonTerminal";
import Terminal from "../lexing/rules/util/Terminal";
import Rule from "./../lexing/rules/util/Rule";
import Token from "../../lib/lexing/util/Token";
import Tag from './../lexing/util/Tag';
import Condition from "./util/Condition";
import Item from "./util/Item";


const START_NON_TERMINAL = new NonTerminal('S\'');
const EMPTY_TERMINAL = new Terminal('E');
const EOF_TERMINAL = new Terminal('EOF');



function ThrowParseError(config) {
	Object.keys(config).map(key => config[key]).forEach(val => {console.log(val)});
	throw new Error('Parse error');
}


export class Parser {

	private rules: Rule[];
	private tokens: Token[];
	private grammarSymbols: Array<Terminal|NonTerminal>;

	private FSM;
	private canonicalSet;

	constructor(rules: Rule[], tokens: Token[], grammarSymbols: Array<Terminal|NonTerminal>) {
		this.rules = rules;
		this.grammarSymbols = grammarSymbols;
		this.tokens = tokens;
		this.FSM = {};
	}


	FIRST(X: Terminal | NonTerminal | Array<Terminal | NonTerminal>): Terminal[] {
		let that = this;
		let result: Terminal[] = [];

		if (!Array.isArray(X)) {

			if (X instanceof Terminal) {
				return [X];
			}

			this.rules.forEach(rule => {
				// Rules X = ...
				if (rule.lhs.equals(X)) {
					result = result.concat(that.FIRST(rule.rhs));
				}
			});


		} else {

			let currentXIndex = 0;

			for (let i = 0; i < X.length; i++) {
				let set = that.FIRST(X[i]);

				let hasEmptyTerminal = set.filter(term => {
						return term.equals(EMPTY_TERMINAL);
					}).length > 0;

				result = result.concat(set.filter(x => !x.equals(EMPTY_TERMINAL)));

				if (i === X.length - 1 && hasEmptyTerminal) {
					result.push(EMPTY_TERMINAL);
				}

				if (!hasEmptyTerminal) {
					break;
				}
			}
		}

		return result;
	}


	FOLLOW(X: NonTerminal): Terminal[] {
		let that = this;

		if (X.equals(START_NON_TERMINAL)) {
			return [EOF_TERMINAL];
		}

		let result: Terminal[] = [];

		this.rules.forEach(rule => {
			let rhsLen = rule.rhs.length;

			rule.rhs.forEach((elem, index) => {
				if (elem instanceof NonTerminal && elem.equals(X)) {

					// Rule Y = a X b
					if (index < rhsLen - 1) {

						let b = rule.rhs.slice(index + 1);

						let firstB = that.FIRST(b);

						let hasEmptyTerminal = firstB.filter(term => {
								return term.equals(EMPTY_TERMINAL);
							}).length > 0;

						result = result.concat(firstB.filter(elem => !elem.equals(EMPTY_TERMINAL)));

						// If may be empty
						if (hasEmptyTerminal) {
							// Do not create recursion calls
							if (!rule.lhs.equals(X)) {
								result = result.concat(that.FOLLOW(rule.lhs))
							}
						}
					}

					// Rule Y = a X
					if (index === rhsLen - 1) {
						// Do not create recursion calls
						if (!rule.lhs.equals(X)) {
							result = result.concat(this.FOLLOW(rule.lhs));
						}
					}
				}
			});
		});
		return this.dedupSymbols(result);
	}


	CLOSURE(items: Item[]): Item[] {

		let closure: Item[] = items;

		let newItems = [];

		do {
			newItems = [];

			closure.forEach(item => {

				// A -> a.Bb
				let nextElem = item.rule.rhs[item.marker];

				if (nextElem instanceof NonTerminal) {

					this.rules.forEach((rule: Rule, index) => {

						if (nextElem.equals(rule.lhs)) {

							// Check for empty rule
							if (rule.rhs.length == 1 && rule.rhs[0].equals(EMPTY_TERMINAL)) {
								let isAlreadyAdded = closure.filter(item => {
										return item.rule.equals(rule)
											&& item.marker === 1;
									}).length > 0;

								if (!isAlreadyAdded) {
									newItems.push(new Item(rule, 1));
								}
							}
							else {
								let isAlreadyAdded = closure.filter(item => {
										return item.rule.equals(rule)
											&& item.marker === 0;
									}).length > 0;

								if (!isAlreadyAdded) {
									newItems.push(new Item(rule, 0));
								}
							}
						}
					})
				}
			});

			closure = closure.concat(newItems);

		} while (newItems.length > 0);

		return closure;
	}


	GOTO(items: Item[], nextElem: Terminal | NonTerminal) {

		let nextBasisItems = items.filter(item => {
				let nextRuleElem = item.rule.rhs[item.marker];

				return nextRuleElem && nextRuleElem.equals(nextElem);
			})
			.map(item => new Item(item.rule, item.marker + 1));

		return this.CLOSURE(nextBasisItems);
	}


	ACTION(index: number, symbol: Terminal | NonTerminal) {
		return this.getFromFSM(index, symbol);
	}


	buildCanonicalSet() {
		let that = this;

		// стартовое состояние
		// массив пунктов
		let startRule = this.rules[0];
		let startItem = new Item(startRule, 0);
		let startClosure = this.CLOSURE([startItem]);
		let startCondition = new Condition(startClosure);

		let resultConditions = [startCondition];
		let currentConditions = [];
		let newConditionsCount = 1;

		while(newConditionsCount > 0) {
			currentConditions = resultConditions.slice(0);
			newConditionsCount = 0;

			currentConditions.forEach(cond => {
				let items = cond.getItems();

				that.grammarSymbols.forEach(symbol => {
					let gotoItems = that.GOTO(items, symbol);

					if (gotoItems.length > 0) {

						let foundCond = resultConditions.filter(resultCond => {
							return resultCond.itemsEqual(gotoItems);
						})[0];

						if (!foundCond) {
							let newCond = new Condition(gotoItems, symbol);
							resultConditions.push(newCond);

							newConditionsCount += 1;
						}
					}
				})
			})
		}
		this.canonicalSet = resultConditions;
	}


	buildFSMTable() {
		let that = this;

		this.canonicalSet.forEach(state => {

			let items = state.getItems();

			items.forEach(item => {

				// REDUCE Item X -> ...·
				if (item.marker === item.rule.rhs.length) {

					// Check start rule S -> ...·
					if (item.rule.lhs.equals(START_NON_TERMINAL)) {

						that.addToFSM(
							state.getIndex(),
							EOF_TERMINAL,
							{
								operation: 'SUCCESS',
								state: state,
								symbol: EOF_TERMINAL,
								item: item
							}
						);
					}
					else {
						that.FOLLOW(item.rule.lhs).forEach(symbol => {
							that.addToFSM(
								state.getIndex(),
								symbol,
								{
									operation: 'REDUCE',
									state: state,
									symbol: symbol,
									item: item,

									rule: item.rule
								}
							);
						});
					}
				}
				// SHIFT Item X -> ...·(a|A)...
				else {
					let nextElem = item.rule.rhs[item.marker];

					let nextItems = that.GOTO(state.getItems(), nextElem);

					let foundState = that.canonicalSet.filter(state => {
						return state.itemsEqual(nextItems);
					})[0];

					if (!foundState) {
						ThrowParseError({
							message: "Unknown goto state",
							state: state,
							nextElem: nextElem
						});
					}
					else {
						that.addToFSM(
							state.getIndex(),
							nextElem,
							{
								operation: 'SHIFT',
								state: state,
								symbol: nextElem,
								item: item,

								nextState: foundState
							}
						)
					}
				}
			});
		})
	}


	parse() {

		this.buildCanonicalSet();

		this.buildFSMTable();

		// Collect sequence of reduces to build a tree
		let reducesSequence = [];

		let startCondIndex = 0;
		let startCond = this.canonicalSet[0];
		let stack = [startCond];

		while (true) {
			let cond = stack[stack.length - 1];
			let token = this.tokens[0];
			let terminal = new Terminal(token.getTag());

			let action = this.ACTION(cond.getIndex(), terminal);

			if (!action) {
				ThrowParseError({
					message: 'LR error on step',
					stack: JSON.stringify(stack.map(x => x.getIndex()).join()),
					tokens: JSON.stringify(this.tokens)
				});
			}

			else if (action.description.operation === 'SHIFT') {

				// console.log('SHIFT');
				// console.log(JSON.stringify(action.description.item));
				// console.log(stack.map(x => x.getIndex()).join());

				this.tokens = this.tokens.slice(1);
				stack.push(action.description.nextState);

				//console.log(JSON.stringify(action.description.nextState));
			}

			else if (action.description.operation === 'REDUCE') {

				console.log('REDUCE');
				action.description.rule.logRule();
				//console.log(JSON.stringify(action.description.item));
				//console.log(stack.map(x => x.getIndex()).join());

				var length;
				if (action.description.rule.rhs[0].equals(EMPTY_TERMINAL)) {
					length = 0;
				} else {
					length = action.description.rule.rhs.length;
				}

				if (length > 0) {
					stack = stack.slice(0, -length);
				}

				let topState = stack[stack.length - 1];

				let actionAfterReduce = this.ACTION(topState.getIndex(), action.description.rule.lhs);
				stack.push(actionAfterReduce.description.nextState);
			}

			else if (action.description.operation === 'SUCCESS') {
				console.log('SUCCESS');
				break;
			}

			else {
				ThrowParseError({
					message: 'Unknown LR step type'
				});
			}
		}

		console.log(reducesSequence);


	}


	// UTIL:
	addToFSM(index: number, symbol: Terminal | NonTerminal, value: any) {
		if (!this.FSM[index]) {
			this.FSM[index] = [];
		}
		this.FSM[index].push({
			symbol: symbol,
			description: value
		});
	}
	getFromFSM(index: number, symbol: Terminal | NonTerminal) {
		return this.FSM[index].filter(op => {
			return op.symbol.equals(symbol);
		})[0];
	}
	dedup(array, comp) {
		let unique = [];

		array.forEach(item => {
			if (unique.filter(comp.bind(null, item)).length === 0) {
				unique.push(item);
			}
		});

		return unique;
	}
	dedupSymbols(symbols) {
		return this.dedup(symbols, (a, b) => {
			return a.equals(b);
		})
	}
}