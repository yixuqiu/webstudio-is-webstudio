import { expect, test } from "@jest/globals";
import { prefixStyles } from "./prefixer";

test("prefix background-clip", () => {
  expect(
    prefixStyles(
      new Map([["background-clip", { type: "keyword", value: "text" }]])
    )
  ).toEqual(
    new Map([
      ["-webkit-background-clip", { type: "keyword", value: "text" }],
      ["background-clip", { type: "keyword", value: "text" }],
    ])
  );
});

test("prefix user-select", () => {
  expect(
    prefixStyles(new Map([["user-select", { type: "keyword", value: "none" }]]))
  ).toEqual(
    new Map([
      ["-webkit-user-select", { type: "keyword", value: "none" }],
      ["user-select", { type: "keyword", value: "none" }],
    ])
  );
});

test("prefix text-size-adjust", () => {
  expect(
    prefixStyles(
      new Map([["text-size-adjust", { type: "keyword", value: "auto" }]])
    )
  ).toEqual(
    new Map([
      ["-webkit-text-size-adjust", { type: "keyword", value: "auto" }],
      ["text-size-adjust", { type: "keyword", value: "auto" }],
    ])
  );
});
