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

let generateAddr = function() {
	let count = 0;

	generateAddr = function() {
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
			case 'EMPTY_CLOSED_STMTS':
				break;
			case 'IF':
				break;
			case 'WHILE':
				break;
			case 'DO_WHILE':
				break;
			case 'EXPR_RESOLVE':
				break;
			case 'ASSIGNMENT_EXPRESSION':
				break;
			case 'INCREMENT_EXPRESSION':
				break;
			case 'BLOCKS':
				node.code = args[0].code + args[1].code;
				break;
			case 'STATEMENT':
				let idNode = args[1];
				let exprNode = args[3];

				node.addr = generateAddr();
				node.code = exprNode.code +
					genCode(node.addr, '=', exprNode.addr);

				symbolsTable[hash(currentBlockId, idNode.token.getValue())] = {
					blockId: currentBlockId,
					addr: node.addr
				};
				break;

			case 'ADD_EXPRESSION':
				node.addr = generateAddr();
				node.code = args[0].code + args[2].code +
						genCode(node.addr, '=', args[0].addr, '+', args[2].addr);

				symbolsTable[hash(currentBlockId, node.addr)] = {
					blockId: currentBlockId,
					addr: node.addr
				};
				break;

			case 'MINUS_EXPRESSION':
				node.addr = generateAddr();
				node.code = args[0].code + args[2].code +
					genCode(node.addr, '=', args[0].addr, '-', args[2].addr);
				break;


			case 'TERM_MULTIPLY':
				node.addr = generateAddr();
				node.code = args[0].code + args[2].code +
					genCode(node.addr, '=', args[0].addr, '*', args[2].addr);
				break;

			case 'TERM_DIVIDE':
				node.addr = generateAddr();
				node.code = args[0].code + args[2].code +
					genCode(node.addr, '=', args[0].addr, '/', args[2].addr);
				break;
			case 'CLOSED_STATEMENTS':
				node.code = args[0].code + args[1].code;
				break;
			case 'BLOCK':
				currentBlockId = uuid();
				node.code = args[1].code + args[2].code;
				break;
			case 'PROGRAM_RESOLVE_BLOCK':
			case 'CLOSED_STATEMENT':
			case 'EXPR_RESOLVE_TERM':
			case 'TERM_RESOLVE_FACTOR':
				let resolveNode = args[0];

				node.code = resolveNode.code;
				node.addr = resolveNode.addr;
				break;
			case 'FACTOR_RESOLVE_NUMBER':
				let numberNode = args[0];

				node.addr = generateAddr();
				node.code = genCode(node.addr, '=', numberNode.token.getValue());
				break;
			case 'FACTOR_RESOLVE_ID':
				idNode = args[0];
				let symbol = symbolsTable[hash(currentBlockId, idNode.token.getValue())];

				node.addr = symbol.addr;
				node.code = '';
				break;
			case 'FACTOR_PARENTHESIS':
				node.code = args[1].code;
				node.addr = args[1].addr;
				break;
			case 'EMPTY_CLOSED_STATEMENTS':
			case 'EMPTY_BLOCK':
				node.code = '';
				break;
		}
	}
}

