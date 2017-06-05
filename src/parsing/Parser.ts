import NonTerminal from "../lexing/rules/util/NonTerminal";
import Terminal from "../lexing/rules/util/Terminal";
import Rule from "./../lexing/rules/util/Rule";
import Token from "./../lexing/util/Token";
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

						result = result.concat(
							firstB.filter(elem => !elem.equals(EMPTY_TERMINAL))
						);

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

		return Parser.dedupSymbols(result);
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

					this.rules.forEach((rule: Rule) => {

						if (nextElem.equals(rule.lhs)) {

							// Check for empty rule
							if (rule.isEmptyRule()) {
								let isAlreadyAdded = closure.filter(item => {
										return item.rule.equals(rule)
											&& item.marker === 1;
									}).length > 0;

								if (!isAlreadyAdded) {
									newItems.push(new Item(rule, 1));
								}
							}
							// The usual rule
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

		let startStateIndex = 0;
		let startState = this.canonicalSet[0];
		let statesStack = [startState];
		let tokens = this.tokens;

		let reducesSequence = [];
		let tokensStack = [];

		let nodesStack = [];

		while (true) {
			let currentState = statesStack[statesStack.length - 1];
			let token = tokens[0];
			let terminal = new Terminal(token.getTag());

			let action = this.ACTION(currentState.getIndex(), terminal);

			if (!action) {
				ThrowParseError({
					message: 'Unknown FSM action',
					terminal: terminal
				});
			} else {

				let operationName = action.description.operation;
				let nextState = action.description.nextState;

				if (operationName === 'SHIFT') {
					// console.log('SHIFT')
					//action.description.rule.logRule()
					let shiftedToken = tokens.shift();

					nodesStack.push({
						isLeaf: true,
						token: shiftedToken
					});

					statesStack.push(nextState);
				}
				else if (operationName === 'REDUCE') {

					let reduceRule = action.description.rule;
					reducesSequence.push(reduceRule);

					// Remove from stack length of production rhs items
					let length;
					if (reduceRule.isEmptyRule()) {
						length = 0;

						let emptyToken = new Token('E', null);
						nodesStack.push({
							isLeaf: true,
							token: emptyToken
						});

					} else {
						length = reduceRule.rhs.length;
						statesStack = statesStack.slice(0, -length);
					}

					// Perform reduce
					let topState = statesStack[statesStack.length - 1];
					let actionAfterReduce = this.ACTION(topState.getIndex(), reduceRule.lhs);
					statesStack.push(actionAfterReduce.description.nextState);

					// Get tokens, that correspond to reduced rule
					let ruleNodes;
					if (length > 0) {
						ruleNodes = nodesStack.slice(-length);
						nodesStack = nodesStack.slice(0, -length);
					} else {
						ruleNodes = nodesStack.slice(-1);
						nodesStack = nodesStack.slice(0, -1);
					}

					nodesStack.push({
							isLeaf: false,
							rule: reduceRule,
							children: ruleNodes
						}
						// new Node(
						// 	reduceRule,
						// 	false,
						// 	ruleNodes
						// )
					);

					// console.log('REDUCE');
					// action.description.rule.logRule();
					// console.log(JSON.stringify(ruleNodes));
					// console.log(action.description.rule.semanticRule);



				}
				else if (operationName === 'SUCCESS') {
					console.log('SUCCESS');
					break;
				}
				else {
					ThrowParseError({
						message: 'Unknown LR step type'
					});
				}
			}
		}
		return nodesStack[0];
	}

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

	static dedup(array, comp) {
		let unique = [];
		array.forEach(item => {
			if (unique.filter(comp.bind(null, item)).length === 0) {
				unique.push(item);
			}
		});
		return unique;
	}

	static dedupSymbols(symbols) {
		return this.dedup(symbols, (a, b) => {
			return a.equals(b);
		})
	}
}

//
// class Node {
// 	public value;
// 	public rule: Rule;
// 	public isLeaf: boolean;
// 	public children: Node[] = [];
//
// 	constructor(rule: Rule, isLeaf: boolean, children?: Node[]) {
// 		this.rule = rule;
// 		if (children) {
// 			this.children = children;
// 		}
// 	}
//
// 	addChild(node: Node) {
// 		this.children.push(node);
// 	}
// }












