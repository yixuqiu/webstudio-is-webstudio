import { shallowEqual } from "shallow-equal";
import { z } from "zod";
import { toast } from "@webstudio-is/design-system";
import {
  Instance,
  Instances,
  WebstudioFragment,
  findTreeInstanceIdsExcludingSlotDescendants,
} from "@webstudio-is/sdk";
import {
  $selectedInstanceSelector,
  $selectedPage,
  $project,
  $registeredComponentMetas,
  $instances,
} from "../nano-states";
import type { InstanceSelector, DroppableTarget } from "../tree-utils";
import {
  computeInstancesConstraints,
  deleteInstanceMutable,
  findAvailableDataSources,
  findClosestDroppableTarget,
  extractWebstudioFragment,
  insertWebstudioFragmentCopy,
  isInstanceDetachable,
  updateWebstudioData,
  getWebstudioData,
  insertInstanceChildrenMutable,
} from "../instance-utils";
import { portalComponent } from "@webstudio-is/react-sdk";

const version = "@webstudio/instance/v0.1";

const InstanceData = WebstudioFragment.extend({
  instanceSelector: z.array(z.string()),
});

type InstanceData = z.infer<typeof InstanceData>;

const getTreeData = (targetInstanceSelector: InstanceSelector) => {
  const instances = $instances.get();
  if (isInstanceDetachable(instances, targetInstanceSelector) === false) {
    toast.error(
      "This instance can not be moved outside of its parent component."
    );
    return;
  }

  // @todo tell user they can't copy or cut root
  if (targetInstanceSelector.length === 1) {
    return;
  }

  const [targetInstanceId] = targetInstanceSelector;

  return {
    instanceSelector: targetInstanceSelector,
    ...extractWebstudioFragment(getWebstudioData(), targetInstanceId),
  };
};

const stringify = (data: InstanceData) => {
  return JSON.stringify({ [version]: data });
};

const ClipboardData = z.object({ [version]: InstanceData });

const parse = (clipboardData: string): InstanceData | undefined => {
  try {
    const data = ClipboardData.parse(JSON.parse(clipboardData));
    return data[version];
  } catch {
    return;
  }
};

export const mimeType = "application/json";

export const getPortalFragmentSelector = (
  instances: Instances,
  instanceSelector: InstanceSelector
) => {
  const instance = instances.get(instanceSelector[0]);
  if (
    instance?.component !== portalComponent ||
    instance.children.length === 0 ||
    instance.children[0].type !== "id"
  ) {
    return;
  }
  // first portal child is always fragment
  return [instance.children[0].value, ...instanceSelector];
};

const getPasteTarget = (
  data: InstanceData,
  instanceSelector: InstanceSelector
): undefined | DroppableTarget => {
  const instances = $instances.get();

  // paste after selected instance
  if (shallowEqual(instanceSelector, data.instanceSelector)) {
    // body is not allowed to copy
    // so clipboard always have at least two level instance selector
    const [currentInstanceId, parentInstanceId] = instanceSelector;
    const parentInstance = instances.get(parentInstanceId);
    if (parentInstance === undefined) {
      return;
    }
    const indexWithinChildren = parentInstance.children.findIndex(
      (child) => child.type === "id" && child.value === currentInstanceId
    );
    return {
      parentSelector: instanceSelector.slice(1),
      position: indexWithinChildren + 1,
    };
  }

  const newInstances: Instances = new Map();
  for (const instance of data.instances) {
    newInstances.set(instance.id, instance);
  }
  const metas = $registeredComponentMetas.get();
  const rootInstanceId = data.instances[0].id;
  const pasteTarget = findClosestDroppableTarget(
    metas,
    instances,
    instanceSelector,
    computeInstancesConstraints(metas, newInstances, [rootInstanceId])
  );
  if (pasteTarget === undefined) {
    return;
  }

  const newInstanceIds = findTreeInstanceIdsExcludingSlotDescendants(
    newInstances,
    data.instances[0].id
  );
  const preservedChildIds = new Set<Instance["id"]>();
  for (const instance of data.instances) {
    for (const child of instance.children) {
      if (child.type === "id" && newInstanceIds.has(child.value) === false) {
        preservedChildIds.add(child.value);
      }
    }
  }

  // portal descendants ids are preserved
  // so need to prevent pasting portal inside its copies
  // to avoid circular tree
  const dropTargetSelector =
    // consider portal fragment when check for cycles to avoid cases
    // like pasting portal directly into portal
    getPortalFragmentSelector(instances, pasteTarget.parentSelector) ??
    pasteTarget.parentSelector;
  for (const instanceId of dropTargetSelector) {
    if (preservedChildIds.has(instanceId)) {
      return;
    }
  }

  return pasteTarget;
};

export const onPaste = (clipboardData: string) => {
  const fragment = parse(clipboardData);

  const selectedPage = $selectedPage.get();
  const project = $project.get();

  if (
    fragment === undefined ||
    selectedPage === undefined ||
    project === undefined
  ) {
    return false;
  }

  // paste to the root if nothing is selected
  const instanceSelector = $selectedInstanceSelector.get() ?? [
    selectedPage.rootInstanceId,
  ];
  const pasteTarget = getPasteTarget(fragment, instanceSelector);
  if (pasteTarget === undefined) {
    return false;
  }

  updateWebstudioData((data) => {
    const { newInstanceIds } = insertWebstudioFragmentCopy({
      data,
      fragment,
      availableDataSources: findAvailableDataSources(
        data.dataSources,
        data.instances,
        instanceSelector
      ),
    });
    const newRootInstanceId = newInstanceIds.get(fragment.instances[0].id);
    if (newRootInstanceId === undefined) {
      return;
    }
    const children: Instance["children"] = [
      { type: "id", value: newRootInstanceId },
    ];
    insertInstanceChildrenMutable(data, children, pasteTarget);
  });

  return true;
};

export const onCopy = () => {
  const selectedInstanceSelector = $selectedInstanceSelector.get();
  if (selectedInstanceSelector === undefined) {
    return;
  }
  const data = getTreeData(selectedInstanceSelector);
  if (data === undefined) {
    return;
  }
  return stringify(data);
};

export const onCut = () => {
  const selectedInstanceSelector = $selectedInstanceSelector.get();
  if (selectedInstanceSelector === undefined) {
    return;
  }
  // @todo tell user they can't delete root
  if (selectedInstanceSelector.length === 1) {
    return;
  }
  const data = getTreeData(selectedInstanceSelector);
  if (data === undefined) {
    return;
  }
  updateWebstudioData((data) => {
    deleteInstanceMutable(data, selectedInstanceSelector);
  });
  if (data === undefined) {
    return;
  }
  return stringify(data);
};
