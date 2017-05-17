
import Terminal from "../lib/lexing/rules/util/Terminal";
import Nonterminal from "../lib/lexing/rules/util/Nonterminal";
import RulesParser from "./lexing/rules/RulesParser";
import Rule from "./lexing/rules/util/Rule";


let rules = RulesParser.getRules('./rules.txt');

function first(X: Nonterminal) {
	if (X instanceof Terminal)
		return [X];

	let result = [];

	for (let rule in rules) {
		// Rules X = Y ...
		if (rule.lhs.getName() === X.getName()) {

			// Then, first(Y)
			result = result.concat(first(rule.rhs[0]));
		}
	}
	return result;
}



function follow(X: Nonterminal) {
	let result = [];

	for (let rule in rules) {
		let rhsLen = rule.rhs.length;

		rule.rhs.forEach((elem, index) => {
			if (elem instanceof Nonterminal && elem.getName() === X.getName()) {

				// Rule Y = ... X ...
				if (index < rhsLen - 1) {
					result = result.concat(first(rule.rhs[index + 1]));
				}

				// Rule Y = ... X
				if (index === rhsLen - 1) {
					result = result.concat(follow(rule.lhs));
				}
			}
		});
	}
	return result;
}


interface Item {
	rule: Rule,
	marker: number
}


function closure(items: Items[]) {

	let newItems: Items[];

	items.forEach(item => {

		// A -> a.Bb
		let nextElem = item.rule.rhs[item.marker];

		if (nextElem instanceof Nonterminal) {

			rules.forEach(rule => {
				if (nextElem.equals(rule.lhs)) {

					newItems.push({
						rule: rule,
						marker: 0
					});
				}
			})
		}
	});

	if (newItems.length == 0) {
		return items;
	}
	else {
		return closure(items.concat(newItems));
	}
}

//
// // замыкание
// function closeItem(I)
// {
// 	for (item in I)
// 	{
// 		// проверяем то что в пункте Y = ... · X ..., X это нетерминал
// 		if (item.markered.type == NonTerminal)
// 		{
// 			for (rule in rules)
// 			{
// 				// правила X = ...
// 				if (rule.left == item.markered)
// 				{
// 					// добвляем пункт X = · ...
// 					I[] = {rule: rule, marker: 0};
// 				}
// 			}
// 		}
// 	}
// }

// ищем возможные свертки и добавляем их в FSM
function addReducing(I, FSM)
{
	for (item in I)
	{
		// пункты X = ... ·
		if (item.markered == item.end)
		{
			// проверяем стартовое синтетическое правило S = A, где A - стартовый символ
			if (item.rule.left == _START_)
			{
				// если это так, то мы достигли успеха, заносим эту информацию
				FSM[I.index, EOF] = Success;
			} else
			{
				// перебираем все возможные терминалы, которые идут после сворачиваемого символа
				for (term in nextTerminal(item.rule.left))
				{
					/*
					 rule нам понадобится для определения двух вещей:
					 сколько снимать со стека и какой символ класть на вершину
					 */
					FSM[I.index, term] = {operation: Reduce, rule: item.rule};
				}
			}
		}
	}
}

// строим состояния после переноса I под воздействием символа X
function shiftState(I, X)
{
	result = [];
	for (item in I)
	{
		// пункты Y = ... · X ...
		if (item.markered == X)
		{
			// сдвигаем маркер на следующий символ
			result[] = {rule: item.rule, marker: item.marker + 1};
		}
	}
	return closeItem(result);
}

// собственно строим таблицу
function buildFSM()
{
	FSM = {};
	// инициируем состояния замканием пункта S = · A
	states = [closeItem({rule: {S = A}, marker: 0})];
	for (state in states)
	{
		// определяем свертки дял каждого состояния
		addReducing(state, FSM);
		for (X in symbols)
		{
			new = states[] = shiftState(state, X);
			// записываем переход
			FSM[state.index, X] = {operation: Shift, index: new.index};
		}
	}
}







input >> term;
accepted = false;
/*
 в стеке 0 состояние, каждый символ отражается состоянием на стеке,
 количество состояний == количество символов
 */
stack = [0];
while (!accepted)
{
	// текущее состояние - stack.top()
	state = FSM[stack.top(), term];
	switch (state)
	{
		case Success:
			accepted = true;
			break;
		case Shift:
			// просто перенос на новое состояние
			stack.push(state.index);
			input >> term;
			break;
		case Reduce:
			// извлекаем L символов
			stack.pop(state.rule.right.length);
			// state.rule.left - символ в который сворачиваем
			// stack.pop() - родительское правило, которое содержит X
			stack.push(FSM[stack.pop(), state.rule.left]);
			// в итоге заменяем стек {..., Y, ..., Z} на {..., X} для правила X = Y ... Z
			break;
		default:
			throw SyntaxError;
	}
}