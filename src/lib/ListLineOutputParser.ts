import { BaseOutputParser } from "@langchain/core/output_parsers";

export class ListLineOutputParser extends BaseOutputParser<string[]> {
  lc_namespace = ["custom", "output_parsers"];

  async parse(text: string): Promise<string[]> {
    return text
      .replace(/<suggestions>/gi, "")
      .replace(/<\/suggestions>/gi, "")
      .split("\n")
      .map((line) =>
        line
          .replace(/^\s*[-*•]\s*/, "")
          .replace(/^\s*\d+[\.\)]\s*/, "")
          .trim()
      )
      .filter(Boolean);
  }

  getFormatInstructions(): string {
    return `
Return the answer as a list with one item per line.
Do not use numbering or bullet points.
Do not add explanations.
`;
  }
}


