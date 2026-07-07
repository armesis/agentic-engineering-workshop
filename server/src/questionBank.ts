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

export const DEFAULT_TIME_LIMIT_SECONDS = 20;
export const DEFAULT_MULTIPLIER = 1;

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
