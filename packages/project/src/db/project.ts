import { prisma, Prisma } from "@webstudio-is/prisma-client";
import { cloneAssets } from "@webstudio-is/asset-uploader/index.server";
import {
  authorizeProject,
  type AppContext,
  AuthorizationError,
} from "@webstudio-is/trpc-interface/index.server";
import {
  createBuild,
  cloneBuild,
} from "@webstudio-is/project-build/index.server";
import { MarketplaceApprovalStatus, Project, Title } from "../shared/schema";
import { generateDomain, validateProjectDomain } from "./project-domain";

export const loadById = async (
  projectId: Project["id"],
  context: AppContext
) => {
  const canRead = await authorizeProject.hasProjectPermit(
    { projectId, permit: "view" },
    context
  );

  if (canRead === false) {
    throw new AuthorizationError("You don't have access to this project");
  }

  const data = await prisma.project.findUnique({
    where: { id_isDeleted: { id: projectId, isDeleted: false } },
    include: {
      latestBuild: true,
      previewImageAsset: true,
    },
  });

  if (data === null) {
    throw new Error(`Project ${projectId} not found`);
  }

  return Project.parse(data);
};

export const create = async (
  { title }: { title: string },
  context: AppContext
) => {
  Title.parse(title);

  const userId = context.authorization.userId;

  if (userId === undefined) {
    throw new Error("The user must be authenticated to create a project");
  }

  const projectId = crypto.randomUUID();

  const project = await prisma.$transaction(async (client) => {
    const project = await client.project.create({
      data: {
        id: projectId,
        userId,
        title,
        domain: generateDomain(title),
      },
    });

    await createBuild({ projectId: project.id }, context, client);

    return project;
  });

  return project;
};

export const markAsDeleted = async (
  projectId: Project["id"],
  context: AppContext
) => {
  const canDelete = await authorizeProject.hasProjectPermit(
    { projectId, permit: "own" },
    context
  );

  if (canDelete === false) {
    return { errors: "Only the owner can delete the project" };
  }

  return await prisma.project.update({
    where: { id: projectId },
    data: { isDeleted: true },
  });
};

const assertEditPermission = async (projectId: string, context: AppContext) => {
  const canEdit = await authorizeProject.hasProjectPermit(
    { projectId, permit: "edit" },
    context
  );

  if (canEdit === false) {
    throw new Error(
      "Only a token or user with edit permission can edit the project."
    );
  }
};

export const rename = async (
  {
    projectId,
    title,
  }: {
    projectId: Project["id"];
    title: string;
  },
  context: AppContext
) => {
  Title.parse(title);

  await assertEditPermission(projectId, context);

  return await prisma.project.update({
    where: { id: projectId },
    data: { title },
  });
};

export const updatePreviewImage = async (
  {
    projectId,
    assetId,
  }: {
    projectId: Project["id"];
    assetId: string | null;
  },
  context: AppContext
) => {
  await assertEditPermission(projectId, context);

  return await prisma.project.update({
    where: { id: projectId },
    data: { previewImageAssetId: assetId },
  });
};

export const clone = async (
  {
    projectId,
    title,
  }: {
    projectId: string;
    title?: string | undefined;
  },
  context: AppContext
) => {
  const project = await loadById(projectId, context);
  if (project === null) {
    throw new Error(`Not found project "${projectId}"`);
  }

  const { userId } = context.authorization;

  if (userId === undefined) {
    throw new Error("The user must be authenticated to clone the project");
  }

  const newProjectId = crypto.randomUUID();

  const clonedProject = await prisma.$transaction(async (client) => {
    await cloneAssets(
      {
        fromProjectId: project.id,
        toProjectId: newProjectId,

        // Permission check on newProjectId will fail until this transaction is committed.
        // We have to skip it, but it's ok because registerProjectOwner is right above
        checkPermissions: false,
      },
      context,
      client
    );

    const clonedProject = await client.project.create({
      data: {
        id: newProjectId,
        userId: userId,
        title: title ?? `${project.title} (copy)`,
        domain: generateDomain(project.title),
        previewImageAssetId: project.previewImageAsset?.id,
      },
      include: {
        previewImageAsset: true,
      },
    });

    await cloneBuild(
      {
        fromProjectId: project.id,
        toProjectId: newProjectId,
        deployment: undefined,
      },
      context,
      client
    );

    return clonedProject;
  });

  return Project.parse(clonedProject);
};

export const updateDomain = async (
  input: {
    id: string;
    domain: string;
  },
  context: AppContext
) => {
  const domainValidation = validateProjectDomain(input.domain);

  if (domainValidation.success === false) {
    throw new Error(domainValidation.error);
  }

  const { domain } = domainValidation;

  await assertEditPermission(input.id, context);

  try {
    const project = await prisma.project.update({
      data: { domain },
      where: { id: input.id },
    });
    return project;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(`Domain "${domain}" is already used`);
    }
    throw error;
  }
};

export const setMarketplaceApprovalStatus = async (
  {
    projectId,
    marketplaceApprovalStatus,
  }: {
    projectId: Project["id"];
    marketplaceApprovalStatus: MarketplaceApprovalStatus;
  },
  context: AppContext
) => {
  if (
    marketplaceApprovalStatus === "APPROVED" ||
    marketplaceApprovalStatus === "REJECTED"
  ) {
    throw new Error("User can't approve or reject");
  }
  await assertEditPermission(projectId, context);

  return await prisma.project.update({
    where: { id: projectId },
    data: { marketplaceApprovalStatus },
  });
};
