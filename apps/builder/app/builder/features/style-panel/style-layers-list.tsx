import {
  toValue,
  type FunctionValue,
  type LayersValue,
  type StyleProperty,
  type TupleValue,
} from "@webstudio-is/css-engine";
import {
  CssValueListArrowFocus,
  CssValueListItem,
  Flex,
  Label,
  SmallIconButton,
  SmallToggleButton,
  useSortable,
} from "@webstudio-is/design-system";
import type { SectionProps } from "./sections";
import {
  deleteLayer,
  getLayerCount,
  hideLayer,
  swapLayers,
  updateLayer,
} from "./style-layer-utils";
import { useMemo } from "react";
import type {
  DeleteProperty,
  StyleUpdateOptions,
} from "./shared/use-style-data";
import { FloatingPanel } from "~/builder/shared/floating-panel";
import {
  EyeconClosedIcon,
  EyeconOpenIcon,
  SubtractIcon,
} from "@webstudio-is/icons";
import { ColorThumb } from "./shared/color-thumb";
import { colord, type RgbaColor } from "colord";

type LayerListProps = SectionProps & {
  disabled?: boolean;
  label: string;
  property: StyleProperty;
  value: TupleValue | LayersValue;
  deleteProperty: DeleteProperty;
  deleteLayer?: (index: number) => boolean | void;
  swapLayers?: (oldIndex: number, newIndex: number) => void;
  hideLayer?: (index: number) => void;
  renderContent: (props: {
    index: number;
    layer: TupleValue | FunctionValue;
    property: StyleProperty;
    propertyValue: string;
    onDeleteLayer: (index: number) => void;
    onEditLayer: (
      index: number,
      layers: TupleValue | LayersValue,
      options: StyleUpdateOptions
    ) => void;
    deleteProperty: DeleteProperty;
  }) => JSX.Element;
};

const extractPropertiesFromLayer = (layer: TupleValue | FunctionValue) => {
  if (layer.type === "function") {
    const value = `${layer.name}(${toValue(layer.args)})`;
    return { name: value, value, color: undefined };
  }

  const name = [];
  const shadow = [];
  let color: RgbaColor | undefined;
  for (const item of Object.values(layer.value)) {
    if (item.type === "unit") {
      const value = toValue(item);
      name.push(value);
      shadow.push(value);
    }

    if (item.type === "rgb") {
      color = colord(toValue(item)).toRgb();
      shadow.push(toValue(item));
    }

    if (item.type === "keyword") {
      if (colord(item.value).isValid() === false) {
        name.push(item.value);
      } else {
        color = colord(item.value).toRgb();
      }
      shadow.push(item.value);
    }

    if (item.type === "unparsed") {
      name.push(item.value);
      shadow.push(item.value);
    }

    if (item.type === "function") {
      const value = `${item.name}(${toValue(item.args)})`;
      name.push(value);
      shadow.push(value);
    }
  }

  return { name: name.join(" "), value: shadow.join(" "), color };
};

export const LayersList = (props: LayerListProps) => {
  const {
    label,
    property,
    value,
    currentStyle,
    createBatchUpdate,
    renderContent,
    deleteProperty,
  } = props;
  const layersCount = getLayerCount(property, currentStyle);

  const sortableItems = useMemo(
    () =>
      Array.from(Array(layersCount), (_, index) => ({
        id: String(index),
        index,
      })),
    [layersCount]
  );

  const { dragItemId, placementIndicator, sortableRefCallback } = useSortable({
    items: sortableItems,
    onSort: (newIndex, oldIndex) =>
      props.swapLayers
        ? props.swapLayers(oldIndex, newIndex)
        : swapLayers(
            property,
            newIndex,
            oldIndex,
            currentStyle,
            createBatchUpdate
          ),
  });

  const handleDeleteLayer = (index: number) => {
    return props?.deleteLayer
      ? props.deleteLayer(index)
      : deleteLayer(property, index, value, createBatchUpdate);
  };

  const handleHideLayer = (index: number) => {
    return props?.hideLayer
      ? props.hideLayer(index)
      : hideLayer(property, index, value, createBatchUpdate);
  };

  const onEditLayer = (
    index: number,
    newLayers: TupleValue | LayersValue,
    options: StyleUpdateOptions
  ) => {
    return updateLayer(
      property,
      newLayers,
      value,
      index,
      createBatchUpdate,
      options
    );
  };

  return (
    <CssValueListArrowFocus dragItemId={dragItemId}>
      <Flex direction="column" ref={sortableRefCallback}>
        {value.value.map((layer, index) => {
          // Because we are using a tuple or function to represent the layers,
          // We use tuple for text-shadow and box-shadow properties
          // and function for filter and backdrop-filter property

          const isLayerATupleOrFunction =
            layer.type === "tuple" || layer.type === "function";

          if (isLayerATupleOrFunction === false) {
            return;
          }

          const id = String(index);
          const properties = extractPropertiesFromLayer(layer);

          return (
            <FloatingPanel
              key={index}
              title={label}
              content={renderContent({
                index,
                property,
                layer,
                onEditLayer,
                propertyValue: properties.value,
                onDeleteLayer: handleDeleteLayer,
                deleteProperty,
              })}
            >
              <CssValueListItem
                id={id}
                draggable={value.value.length > 1}
                active={dragItemId === id}
                index={index}
                label={<Label truncate>{properties.name}</Label>}
                hidden={
                  (layer.type === "tuple" || layer.type === "function") &&
                  layer?.hidden
                }
                thumbnail={
                  property === "textShadow" || property === "boxShadow" ? (
                    <ColorThumb color={properties.color} />
                  ) : undefined
                }
                buttons={
                  <>
                    {layer.type === "tuple" || layer.type === "function" ? (
                      <SmallToggleButton
                        variant="normal"
                        pressed={layer?.hidden}
                        disabled={false}
                        tabIndex={-1}
                        onPressedChange={() => handleHideLayer(index)}
                        icon={
                          layer?.hidden ? (
                            <EyeconClosedIcon />
                          ) : (
                            <EyeconOpenIcon />
                          )
                        }
                      />
                    ) : undefined}
                    <SmallIconButton
                      variant="destructive"
                      tabIndex={-1}
                      disabled={
                        (layer.type === "tuple" || layer.type === "function") &&
                        layer.hidden
                      }
                      icon={<SubtractIcon />}
                      onClick={() => handleDeleteLayer(index)}
                    />
                  </>
                }
              />
            </FloatingPanel>
          );
        })}
        {placementIndicator}
      </Flex>
    </CssValueListArrowFocus>
  );
};
