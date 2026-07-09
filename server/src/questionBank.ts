export interface Question {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  timeLimitSeconds: number;
  multiplier: number;
}

export const DEFAULT_TIME_LIMIT_SECONDS = 5;
export const DEFAULT_MULTIPLIER = 1;

export interface HostQuestionView {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  timeLimitSeconds: number;
  startedAtMs: number;
}

// The Host Screen shows full question text, options, and a countdown; Player
// devices show only 4 shape/color-coded buttons and must never receive the
// correct answer (or any question content) over the wire.
export function toHostQuestionView(question: Question, startedAtMs: number): HostQuestionView {
  const { question: text, optionA, optionB, optionC, optionD, timeLimitSeconds } = question;
  return { question: text, optionA, optionB, optionC, optionD, timeLimitSeconds, startedAtMs };
}

export interface HostRevealView {
  correctOption: Question["correctOption"];
}

export function toHostRevealView(question: Question): HostRevealView {
  return { correctOption: question.correctOption };
}

// Fixed schema, one header row: question,option_a,option_b,option_c,option_d,correct_option,time_limit_seconds,multiplier
export function parseQuestionBank(csv: string): Question[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const [, ...rows] = lines;

  return rows.map((line) => {
    const [
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      timeLimitRaw,
      multiplierRaw,
    ] = line.split(",").map((cell) => cell.trim());

    return {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption: correctOption as Question["correctOption"],
      timeLimitSeconds: timeLimitRaw ? Number(timeLimitRaw) : DEFAULT_TIME_LIMIT_SECONDS,
      multiplier: multiplierRaw ? Math.round(Number(multiplierRaw)) : DEFAULT_MULTIPLIER,
    };
  });
}
