const fs = require('fs');

import KEYWORDS from './util/Keywords';
import SYMBOLS from './util/Symbols';

import Tag from './util/Tag';
import Token from './util/Token';


export default class Lexer {
	private fileContents: string;
	private characterIndex: number = -1;
	private currentCharacter: string = null;

	// Will be filled after lex work
	private tokens: Token[] = [];
	private symbolsTable = {};

	constructor(fileName: string) {
		this.fileContents = fs.readFileSync(fileName, 'utf8');
	}

	public lex(): void {
		while (true) {
			let nextToken = this.nextToken();
			this.tokens.push(nextToken);

			if (nextToken.getTag() === Tag.EOF) {
				break;
			}
		}
	}

	public getTokens(): Token[] {
		return this.tokens;
	}

	private peek(): void {
		this.skipAndPeek(0);
	}

	private skipAndPeek(skipLength: number): void {
		if (this.characterIndex + 1 + skipLength > this.fileContents.length - 1) {
			this.currentCharacter = null;
		} else {
			this.currentCharacter = this.fileContents[this.characterIndex + 1 + skipLength];
			this.characterIndex += 1;
		}
	}

	private preview(length: number): string | null {
		if (this.characterIndex + 1 > this.fileContents.length - 1) {
			return null;
		} else {
			return this.fileContents.substr(this.characterIndex + 1, length);
		}
	}

	private nextToken(): Token {
		let token: Token = null;
		this.peek();

		while (!token) {
			if (this.currentCharacter === null) {
				token = new Token(Tag.EOF);
			}

			else if (Lexer.isLineEnding(this.currentCharacter)) {
				this.peek();
			}

			else if (Lexer.isWhiteSpace(this.currentCharacter)) {
				this.peek();
			}

			else if (SYMBOLS[this.currentCharacter + this.preview(1)]) {
				token = new Token(SYMBOLS[this.currentCharacter + this.preview(1)]);
				this.peek();
			}
			else if (SYMBOLS[this.currentCharacter]) {
				token = new Token(SYMBOLS[this.currentCharacter]);
			}


			else if (Lexer.isDigit(this.currentCharacter)) {
				let value: number = 0;

				while (Lexer.isDigit(this.currentCharacter)) {
					value = value * 10 + parseInt(this.currentCharacter, 10);
					this.peek();
				}
				token = new Token(Tag.NUMBER, value);
			}

			else if (Lexer.isLetter(this.currentCharacter)) {
				let word = '';

				while(Lexer.isLetter(this.currentCharacter)) {
					word += this.currentCharacter;
					this.peek();
				}

				if (KEYWORDS[word]) {
					token = new Token(KEYWORDS[word]);
				}
				else {
					token = new Token(Tag.ID, word);


				}
			}

			else if (Lexer.isColumn(this.currentCharacter)) {
				let string = '';
				this.peek();

				while(!Lexer.isColumn(this.currentCharacter)) {
					string += this.currentCharacter;
					this.peek();
				}

				if (Lexer.isColumn(this.currentCharacter)) {
					this.peek();
				} else {
					throw new Error(`Closing column not found: '${this.currentCharacter}'`);
				}

				token = new Token(Tag.STRING, string);
			}

			else {
				throw new Error(`Unsupported character: '${this.currentCharacter}'`);
			}
		}
		return token;
	}

	static isWhiteSpace(character): boolean {
		let charCode: number = character.charCodeAt(0);

		// tab code is 9
		// space code is 32
		return charCode === 9 || charCode === 32;
	}

	static isLineEnding(character): boolean {
		let charCode: number = character.charCodeAt(0);

		return charCode === 10;
	}

	static isDigit(character): boolean {
		if (character === null) {
			return false;
		}
		let charCode = character.charCodeAt(0);

		return (charCode >= 48 && charCode <= 57); // 0-9
	}

	static isLetter(character): boolean {
		if (character === null) {
			return false;
		}
		return character.match(/[a-z]/i);
	}

	static isColumn(character): boolean {
		return character === '\'';
	}
}