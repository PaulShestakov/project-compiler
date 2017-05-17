export declare class FileContentsReader {
    private fileName;
    private fileContents;
    private streamIndex;
    constructor(fileName: string);
    getNextCharacter(): string | null;
}
