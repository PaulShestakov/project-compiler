import Token from './util/Token';
export default class Lexer {
    private fileContents;
    private characterIndex;
    private currentCharacter;
    constructor(fileName: string);
    peek(): void;
    skipAndPeek(skipLength: number): void;
    preview(length: number): string | null;
    nextToken(): Token;
    static isWhiteSpace(character: any): boolean;
    static isLineEnding(character: any): boolean;
    static isDigit(character: any): boolean;
    static isLetter(character: any): boolean;
    static getTokens(fileName: string): void;
}
