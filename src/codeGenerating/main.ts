const uuid = require('uuid/v4');

let symbolsTable = {};

let currentBlockId = uuid();

let code = '';

export default function ascendantWalk(node) {
	//console.log(JSON.stringify(node.children))
	if (node.children) {
		node.children.forEach(child => ascendantWalk(child));
	}

	visit(node);
}

function hash(block_id, id) {
	return block_id + id;
}

let genCode = function(...args: any[]) {
	return args.join(' ') + '\n';
};

let genVariableName = function() {
	let count = 0;

	genVariableName = function() {
		return 't' + count++;
	};
	return 't' + count++;
};

function visit(node) {

	if (!node.isLeaf) {
		console.log(node.rule.description);

		let rule = node.rule;
		let args = node.children;



		switch(node.rule.description) {
			case 'S_RESOLVE':
				break;
			case 'PROGRAM_RESOLVE':
				break;
			case 'BLOCKS':
				break;
			case 'EMPTY_BLOCK':
				break;
			case 'BLOCK':
				currentBlockId = uuid();
				break;
			case 'CLOSED_STATEMENTS':
				break;
			case 'EMPTY_CLOSED_STMTS':
				break;
			case 'CLOSED_STATEMENT':
				break;
			case 'STATEMENT':
				let idNode = args[1];
				let exprNode = args[3];

				node.varName = genVariableName();
				node.code = exprNode.code + '\n' +
					genCode(node.varName, '=', exprNode.varName);

				symbolsTable[hash(currentBlockId, idNode.token.name)] = {
					blockId: currentBlockId,
					varName: node.varName
				};
				break;

			case 'IF':
				break;
			case 'WHILE':
				break;
			case 'DO_WHILE':
				break;
			case 'ADD_EXPRESSION':

				node.varName = genVariableName();
				node.code = args[0].code + '\n' +
						args[2].code + '\n' +
						genCode(node.varName, '=', args[0].varName, '+', args[2].varName);

				symbolsTable[hash(currentBlockId, node.varName)] = {
					blockId: currentBlockId,
					varName: node.varName
				};


				break;
			case 'MINUS_EXPRESSION':
				node.varName = genVariableName();
				node.code = args[0].code + '\n' +
					args[2].code + '\n' +
					genCode(node.varName, '=', args[0].varName, '-', args[2].varName);
				break;
			case 'EXPR_RESOLVE':
				break;
			case 'ASSIGNMENT_EXPRESSION':



				let  symbol = symbolsTable[hash(currentBlockId, args[0].token.name)];

				node.code = args[2].code + '\n' +
					genCode(symbol.varName, '=', args[2].varName);


				break;
			case 'INCREMENT_EXPRESSION':
				break;
			case 'TERM_MULTIPLY':
				node.varName = genVariableName();
				node.code = args[0].code + '\n' +
					args[2].code + '\n' +
					genCode(node.varName, '=', args[0].varName, '+', args[2].varName);

				symbolsTable[hash(currentBlockId, idNode.token.name)] = {
					blockId: currentBlockId,
					varName: node.varName,
					idName: idNode.token.name,
					value: exprNode.value
				};
				break;
			case 'TERM_DIVIDE':
				break;

			case 'EXPR_RESOLVE_TERM':
			case 'TERM_RESOLVE_FACTOR':
				let resolveNode = args[0];

				node.code = resolveNode.code;
				node.varName = resolveNode.varName;
				break;

			case 'FACTOR_RESOLVE_NUMBER':
				let numberNode = args[0];

				node.varName = genVariableName();
				node.code = genCode(node.varName, '=', numberNode.token.getValue());

				symbolsTable[hash(currentBlockId, node.varName)] = {
					blockId: currentBlockId,
					varName: node.varName
				};
				break;
			case 'FACTOR_PARENTHESIS':
				break;

		}
	}
	//console.log(node.value)
}

