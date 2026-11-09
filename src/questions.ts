import { Question } from './types';
import { sproutQuestions } from './data/sproutQuestions';
import { exploreQuestions } from './data/exploreQuestions';
import { challengeQuestions } from './data/challengeQuestions';
import { growQuestions } from './data/growQuestions';

export { sproutQuestions, exploreQuestions, challengeQuestions, growQuestions };

export const localQuestions: Question[] = [
  ...sproutQuestions,
  ...exploreQuestions,
  ...challengeQuestions,
  ...growQuestions,
];
