import Tag from './Tag';


const SYMBOLS = {
	'{': Tag.L_BRACE,
	'}': Tag.R_BRACE,
	'(': Tag.L_PARENTHESIS,
	')': Tag.R_PARENTHESIS,

	'+': Tag.PLUS,
	'-': Tag.MINUS,
	'*': Tag.MULTIPLY,
	'/': Tag.DIVIDE,
	'+=': Tag.PLUS_EQUAL,

	'>': Tag.MORE,
	'<': Tag.LESS,
	'=': Tag.EQUAL,
	'>=': Tag.MORE_EQUAL,
	'<=': Tag.LESS_EQUAL,
	'==': Tag.LOOSE_EQUAL,

	';': Tag.SEMICOLON
};

export default SYMBOLS;