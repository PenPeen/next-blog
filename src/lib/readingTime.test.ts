import { calculateReadingMinutes } from "./readingTime";

describe("calculateReadingMinutes", () => {
  it("空文字は1分", () => {
    expect(calculateReadingMinutes("")).toBe(1);
  });

  it("500文字は1分", () => {
    expect(calculateReadingMinutes("あ".repeat(500))).toBe(1);
  });

  it("501文字は2分", () => {
    expect(calculateReadingMinutes("あ".repeat(501))).toBe(2);
  });

  it("1500文字は3分", () => {
    expect(calculateReadingMinutes("あ".repeat(1500))).toBe(3);
  });

  it("空白と改行を足しても分数が変わらない", () => {
    const text = "あ".repeat(500);
    expect(calculateReadingMinutes(`${text}${" \n\t　".repeat(1000)}`)).toBe(1);
  });

  it("絵文字500個は1分", () => {
    expect(calculateReadingMinutes("😀".repeat(500))).toBe(1);
  });
});
