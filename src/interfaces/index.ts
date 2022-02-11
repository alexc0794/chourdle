export interface Letter {
  letter: string;
  status: LetterStatus;
}

export enum LetterStatus {
  UNDETERMINED,
  NOT_FOUND,
  FOUND_EXACT,
  FOUND_IN_WORD,
}
