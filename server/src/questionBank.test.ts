import { describe, expect, it } from "vitest";
import {
  DEFAULT_MULTIPLIER,
  DEFAULT_TIME_LIMIT_SECONDS,
  parseQuestionBank,
} from "./questionBank.js";

const HEADER = "question,option_a,option_b,option_c,option_d,correct_option,time_limit_seconds,multiplier";

describe("parseQuestionBank", () => {
  it("parses a well-formed row into a Question", () => {
    const csv = `${HEADER}\nWhat is 2+2?,3,4,5,6,B,15,2`;
    expect(parseQuestionBank(csv)).toEqual([
      {
        question: "What is 2+2?",
        optionA: "3",
        optionB: "4",
        optionC: "5",
        optionD: "6",
        correctOption: "B",
        timeLimitSeconds: 15,
        multiplier: 2,
      },
    ]);
  });

  it("defaults time_limit_seconds when blank", () => {
    const csv = `${HEADER}\nWhat is 2+2?,3,4,5,6,B,,2`;
    expect(parseQuestionBank(csv)[0].timeLimitSeconds).toBe(DEFAULT_TIME_LIMIT_SECONDS);
  });

  it("defaults multiplier to 1 when blank", () => {
    const csv = `${HEADER}\nWhat is 2+2?,3,4,5,6,B,15,`;
    expect(parseQuestionBank(csv)[0].multiplier).toBe(DEFAULT_MULTIPLIER);
  });

  it("rounds a non-integer multiplier", () => {
    const csv = `${HEADER}\nWhat is 2+2?,3,4,5,6,B,15,2.6`;
    expect(parseQuestionBank(csv)[0].multiplier).toBe(3);
  });

  it("parses multiple rows in order", () => {
    const csv = `${HEADER}\nFirst?,a,b,c,d,A,10,1\nSecond?,a,b,c,d,C,20,3`;
    const questions = parseQuestionBank(csv);
    expect(questions).toHaveLength(2);
    expect(questions[0].question).toBe("First?");
    expect(questions[1].question).toBe("Second?");
  });

  it("ignores trailing blank lines", () => {
    const csv = `${HEADER}\nFirst?,a,b,c,d,A,10,1\n\n`;
    expect(parseQuestionBank(csv)).toHaveLength(1);
  });

  it("returns an empty Question Bank for a header-only CSV", () => {
    expect(parseQuestionBank(HEADER)).toEqual([]);
  });
});
