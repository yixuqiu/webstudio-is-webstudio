import { TextIcon } from "@webstudio-is/icons/svg";
import {
  defaultStates,
  type PresetStyle,
  type WsComponentMeta,
  type WsComponentPropsMeta,
} from "@webstudio-is/react-sdk";
import { div } from "@webstudio-is/react-sdk/css-normalize";
import { props } from "./__generated__/text.props";
import type { defaultTag } from "./text";

const presetStyle = {
  div: [
    ...div,
    {
      property: "minHeight",
      value: { type: "unit", unit: "em", value: 1 },
    },
  ],
} satisfies PresetStyle<typeof defaultTag>;

export const meta: WsComponentMeta = {
  category: "text",
  type: "container",
  label: "Text",
  description:
    "A generic container for any text content that is not a heading or a link.",
  icon: TextIcon,
  states: defaultStates,
  presetStyle,
  order: 0,
  template: [
    {
      type: "instance",
      component: "Text",
      children: [
        {
          type: "text",
          value: "The text you can edit",
          placeholder: true,
        },
      ],
    },
  ],
};

export const propsMeta: WsComponentPropsMeta = {
  props,
  initialProps: ["id", "className", "tag"],
};
