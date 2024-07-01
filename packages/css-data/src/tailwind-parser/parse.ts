import { UnoGenerator, createGenerator } from "@unocss/core";
import { type Theme, presetUno } from "@unocss/preset-uno";
import type { EmbedTemplateStyleDecl } from "@webstudio-is/react-sdk";
import { expandTailwindShorthand } from "./shorthand";
import { substituteVariables } from "./substitute";
import warnOnce from "warn-once";
import { parseCss } from "../parse-css";

let unoLazy: UnoGenerator<Theme> | undefined = undefined;

const uno = () => {
  unoLazy = createGenerator({
    presets: [presetUno()],
  });
  return unoLazy;
};

/**
 * Parses Tailwind classes to CSS by expanding shorthands and substituting variables.
 */
export const parseTailwindToCss = async (classes: string, warn = warnOnce) => {
  const expandedClasses = expandTailwindShorthand(classes);
  const generated = await uno().generate(expandedClasses, {
    preflights: true,
  });

  const cssWithClasses = substituteVariables(generated.css, warn);
  return cssWithClasses;
};

/**
 * Tailwind by default has border-style: solid, but WebStudio doesn't.
 * Provide border-style: solid if border-width is provided.
 **/
const postprocessBorder = (styles: EmbedTemplateStyleDecl[]) => {
  const borderPairs = [
    ["borderTopWidth", "borderTopStyle"],
    ["borderRightWidth", "borderRightStyle"],
    ["borderBottomWidth", "borderBottomStyle"],
    ["borderLeftWidth", "borderLeftStyle"],
  ] as const;

  const resultStyles = [...styles];

  for (const [borderWidthProperty, borderStyleProperty] of borderPairs) {
    const hasWidth = styles.some(
      (style) => style.property === borderWidthProperty
    );
    const hasStyle = styles.some(
      (style) => style.property === borderStyleProperty
    );
    if (hasWidth && hasStyle === false) {
      resultStyles.push({
        property: borderStyleProperty,
        value: {
          type: "keyword",
          value: "solid",
        },
      });
    }
  }
  return resultStyles;
};

/**
 * Parses Tailwind classes to webstudio template format.
 */
export const parseTailwindToWebstudio = async (
  classes: string,
  warn = warnOnce
) => {
  const css = await parseTailwindToCss(classes, warn);
  let styles = Object.values(parseCss(css)).flat();
  // postprocessing
  styles = postprocessBorder(styles);

  return styles;
};
