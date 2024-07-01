import {
  Box,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  css,
  styled,
  theme,
} from "@webstudio-is/design-system";
import { forwardRef, type ComponentProps } from "react";

export const SidebarTabs = styled(Tabs, {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  boxSizing: "border-box",
});

const triggerFocusRing = {
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 4,
    outlineWidth: 2,
    outlineStyle: "solid",
    outlineColor: theme.colors.borderFocus,
    borderRadius: theme.borderRadius[3],
  },
};

const buttonStyle = css({
  position: "relative",
  boxSizing: "border-box",
  flexShrink: 0,
  display: "flex",
  size: theme.spacing[15],
  m: 0,
  userSelect: "none",
  outline: "none",
  alignItems: "center",
  justifyContent: "center",
  color: theme.colors.foregroundSubtle,
  backgroundColor: theme.colors.backgroundPanel,
  border: "none",
  "&:focus-visible": triggerFocusRing,
  "@hover": {
    "&:hover": {
      color: theme.colors.foregroundMain,
      backgroundColor: theme.colors.backgroundHover,
    },
  },

  '&[data-state="active"]': {
    color: theme.colors.foregroundMain,
    backgroundColor: theme.colors.backgroundHover,
  },
});

export const SidebarButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & { label: string }
>(({ label, ...props }, ref) => {
  return (
    <Tooltip side="right" content={label}>
      <button
        {...props}
        ref={ref}
        aria-label={label}
        className={buttonStyle()}
      ></button>
    </Tooltip>
  );
});

export const SidebarTabsTrigger = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof TabsTrigger> & { label: string }
>(({ label, children, ...props }, ref) => {
  return (
    <Tooltip side="right" content={label}>
      <Box>
        <TabsTrigger
          {...props}
          ref={ref}
          aria-label={label}
          className={buttonStyle()}
        >
          {children}
        </TabsTrigger>
      </Box>
    </Tooltip>
  );
});

export const SidebarTabsList = styled(TabsList, {
  boxSizing: "border-box",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  outline: "none",
  borderRight: `1px solid  ${theme.colors.borderMain}`,
  flexGrow: 1,
  backgroundColor: theme.colors.backgroundPanel,
});

export const SidebarTabsContent = styled(TabsContent, {
  flexGrow: 1,
  position: "absolute",
  top: 0,
  left: "100%",
  height: "100%",
  bc: theme.colors.backgroundPanel,
  outline: "none",
  '&[data-state="active"]': {
    borderRight: `1px solid ${theme.colors.borderMain}`,
  },
});
