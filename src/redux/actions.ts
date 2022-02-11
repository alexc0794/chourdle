import { Letter, LetterStatus } from "@/interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "src/store";
import { selectWordle } from ".";


export const enterLetter = createAsyncThunk(
  'wordle/enterLetter',
  async ({ letter }: { letter: string }) => {
    return { letter, status: LetterStatus.UNDETERMINED };
  }
);

export const removeLetter = createAsyncThunk(
  'wordle/removeLetter',
  () => {}
);

export const submitAttempt = createAsyncThunk(
  'wordle/submitAttempt',
  async ({ letters }: { letters: Letter[] }, { getState }) => {
    const state = getState() as RootState;
    const { target } = selectWordle(state);
    return letters.map(({ letter }, i) => {
      if (target.charAt(i) === letter) {
        return { letter, status: LetterStatus.FOUND_EXACT };
      } else if (target.includes(letter)) {
        return { letter, status: LetterStatus.FOUND_IN_WORD };
      }
      return { letter, status: LetterStatus.NOT_FOUND };
    })
  }
);
