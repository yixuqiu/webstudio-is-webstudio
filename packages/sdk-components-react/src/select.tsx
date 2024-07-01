import {
  getClosestInstance,
  getInstanceSelectorById,
  type Hook,
} from "@webstudio-is/react-sdk";
import { forwardRef, type ElementRef, type ComponentProps } from "react";

export const defaultTag = "select";

export const Select = forwardRef<
  ElementRef<typeof defaultTag>,
  ComponentProps<typeof defaultTag>
>((props, ref) => <select {...props} ref={ref} />);

Select.displayName = "Select";

// For each CollapsibleContent component within the selection,
// we identify its closest parent Collapsible component
// and update its open prop bound to variable.
export const hooksSelect: Hook = {
  onNavigatorUnselect: (context, event) => {
    for (const instance of event.instancePath) {
      if (instance.component === `Option`) {
        const option = getClosestInstance(
          event.instancePath,
          instance,
          `Option`
        );
        if (option) {
          const instanceSelector = getInstanceSelectorById(
            event.instanceSelector,
            option.id
          );
          context.setMemoryProp(instanceSelector, "selected", undefined);
        }
      }
    }
  },
  onNavigatorSelect: (context, event) => {
    for (const instance of event.instancePath) {
      if (instance.component === `Option`) {
        const option = getClosestInstance(
          event.instancePath,
          instance,
          `Option`
        );
        if (option) {
          const instanceSelector = getInstanceSelectorById(
            event.instanceSelector,
            option.id
          );
          context.setMemoryProp(instanceSelector, "selected", true);
        }
      }
    }
  },
};
