import { Letter, LetterStatus } from '@/interfaces';
import { createReducer } from '@reduxjs/toolkit';
import { enterLetter, removeLetter, submitAttempt } from '.';


type WordleState = {
  target: string;
  attempts: Letter[][];
  currentAttempt: Letter[];
  hasFoundAnswer: boolean;
  loading: boolean;
  error: boolean;
  letterMapping: { [key: string]: LetterStatus }
};

const initialWordleState: WordleState = {
  target: 'fungus',
  attempts: [
    // [
    //   {letter: 't', status: LetterStatus.NOT_FOUND},
    //   {letter: 'e', status: LetterStatus.FOUND_EXACT},
    //   {letter: 's', status: LetterStatus.NOT_FOUND},
    //   {letter: 't', status: LetterStatus.NOT_FOUND},
    //   {letter: 's', status: LetterStatus.NOT_FOUND},
    // ]
  ],
  currentAttempt: [],
  hasFoundAnswer: false,
  loading: false,
  error: false,
  letterMapping: {},
};

export const wordleReducer = createReducer(initialWordleState, builder => {
  builder
    .addCase(submitAttempt.pending, state => {
      state.loading = true;
    })
    .addCase(submitAttempt.rejected, state => {
      state.loading = false;
      state.error = true;
    })
    .addCase(submitAttempt.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.attempts.push(payload);
      state.currentAttempt = [];
      state.hasFoundAnswer = payload.reduce((hasFoundAnswer: boolean, { status }) => {
        return hasFoundAnswer && status === LetterStatus.FOUND_EXACT
      }, true);
      for (let i = 0; i < payload.length; i++) {
        const { letter, status }: Letter = payload[i];
        if (state.letterMapping[letter] === LetterStatus.FOUND_EXACT) continue;
        else if (state.letterMapping[letter] === LetterStatus.FOUND_IN_WORD && status !== LetterStatus.FOUND_EXACT) continue;
        else state.letterMapping[letter] = status;
      }
    })
    .addCase(enterLetter.fulfilled, (state, { payload }) => {
      state.currentAttempt.push(payload);
    })
    .addCase(removeLetter.fulfilled, (state) => {
      if (!state.currentAttempt.length) return;
      state.currentAttempt.splice(state.currentAttempt.length - 1, 1);
    })
});
