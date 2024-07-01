import * as ToastPrimitive from "@radix-ui/react-toast";
import hotToast, { resolveValue, useToaster } from "react-hot-toast/headless";
import { keyframes, styled } from "../stitches.config";
import { InfoCircleIcon } from "@webstudio-is/icons";
import { Box } from "./box";
import { theme } from "../stitches.config";

const VIEWPORT_PADDING = theme.spacing[2];

const hide = keyframes({
  "0%": { opacity: 1 },
  "100%": { opacity: 0 },
});

const slideIn = keyframes({
  from: { transform: `translateY(calc(0px - ${VIEWPORT_PADDING}px))` },
  to: { transform: "translateY(0)" },
});

const swipeOut = keyframes({
  from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
  to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
});

const StyledViewport = styled(ToastPrimitive.Viewport, {
  position: "absolute",
  top: 0,
  right: 0,
  display: "flex",
  flexDirection: "column",
  padding: VIEWPORT_PADDING,
  gap: VIEWPORT_PADDING,
  minWidth: 200,
  width: "auto",
  maxWidth: "100vw",
  margin: 0,
  listStyle: "none",
  zIndex: theme.zIndices.max,
  outline: "none",
});

const StyledToast = styled(ToastPrimitive.Root, {
  borderRadius: 6,
  boxShadow: "0px 2px 7px rgba(0, 0, 0, 0.1), 0px 5px 17px rgba(0, 0, 0, 0.15)",
  padding: theme.spacing[9],
  display: "flex",
  maxWidth: 250,
  gap: theme.spacing[9],
  alignItems: "center",
  color: theme.colors.hiContrast,
  fontWeight: 500,
  fontSize: theme.deprecatedFontSize[3],
  WebkitFontSmoothing: "antialiased",
  background: theme.colors.backgroundPanel,

  "@media (prefers-reduced-motion: no-preference)": {
    '&[data-state="open"]': {
      animation: `${slideIn} 250ms cubic-bezier(0.16, 1, 0.3, 1)`,
    },
    '&[data-state="closed"]': {
      animation: `${hide} 105ms ease-in`,
    },
    '&[data-swipe="move"]': {
      transform: "translateX(var(--radix-toast-swipe-move-x))",
    },
    '&[data-swipe="cancel"]': {
      transform: "translateX(0)",
      transition: "transform 200ms ease-out",
    },
    '&[data-swipe="end"]': {
      animation: `${swipeOut} 150ms ease-out`,
    },
  },
  variants: {
    variant: {
      error: {
        background: theme.colors.red9,
        color: theme.colors.loContrast,
      },
      success: {
        background: theme.colors.green10,
        color: theme.colors.loContrast,
      },
      blank: {
        background: theme.colors.blue11,
        color: theme.colors.loContrast,
      },
      custom: {},
      loading: {},
    },
  },
});

export const Toaster = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <ToastPrimitive.ToastProvider>
      {toasts.map((toastData) => (
        <StyledToast
          variant={toastData.type}
          key={toastData.id}
          onMouseEnter={startPause}
          onMouseLeave={endPause}
          onClick={() => {
            hotToast.remove(toastData.id);
          }}
        >
          {toastData.type === "blank" && (
            <Box
              css={{
                svg: {
                  width: theme.spacing[11],
                  height: theme.spacing[11],
                },
              }}
            >
              <InfoCircleIcon />
            </Box>
          )}
          <ToastPrimitive.Title>
            {resolveValue(toastData.message, toastData)}
          </ToastPrimitive.Title>
        </StyledToast>
      ))}
      <StyledViewport />
    </ToastPrimitive.ToastProvider>
  );
};

export const toast = {
  info: hotToast,
  error: hotToast.error,
  success: hotToast.success,
  warn: hotToast.custom,
};
