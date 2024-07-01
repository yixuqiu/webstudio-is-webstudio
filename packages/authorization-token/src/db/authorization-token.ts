import {
  prisma,
  type AuthorizationToken,
  type Project,
} from "@webstudio-is/prisma-client";
import {
  authorizeProject,
  type AppContext,
  AuthorizationError,
} from "@webstudio-is/trpc-interface/index.server";

export const findMany = async (
  props: { projectId: Project["id"] },
  context: AppContext
) => {
  // Only owner of the project can list authorization tokens
  const canList = await authorizeProject.hasProjectPermit(
    { projectId: props.projectId, permit: "own" },
    context
  );

  if (canList === false) {
    throw new AuthorizationError(
      "You don't have access to list this project authorization tokens"
    );
  }

  const dbTokens = await prisma.authorizationToken.findMany({
    where: {
      projectId: props.projectId,
    },
    // Stable order
    orderBy: [
      {
        createdAt: "asc",
      },
      { token: "asc" },
    ],
  });

  return dbTokens;
};

export const tokenDefaultPermissions = {
  canClone: true,
  canCopy: true,
};

export type TokenPermissions = typeof tokenDefaultPermissions;

export const getTokenPermissions = async (
  props: { projectId: Project["id"]; token: AuthorizationToken["token"] },
  _context: AppContext
): Promise<TokenPermissions> => {
  const dbToken = await prisma.authorizationToken.findUnique({
    where: {
      // eslint-disable-next-line camelcase
      token_projectId: {
        projectId: props.projectId,
        token: props.token,
      },
    },
  });

  if (dbToken === null) {
    throw new AuthorizationError("Authorization token not found");
  }

  switch (dbToken.relation) {
    // canClone, canCopy permissions can be applied for viewers only
    case "viewers":
      return {
        canClone: dbToken.canClone,
        canCopy: dbToken.canCopy,
      };
    default:
      return tokenDefaultPermissions;
  }
};

export const create = async (
  props: {
    projectId: Project["id"];
    relation: AuthorizationToken["relation"];
    name: string;
  },
  context: AppContext
) => {
  const tokenId = crypto.randomUUID();

  // Only owner of the project can create authorization tokens
  const canCreateToken = await authorizeProject.hasProjectPermit(
    { projectId: props.projectId, permit: "own" },
    context
  );

  if (canCreateToken === false) {
    throw new AuthorizationError(
      "You don't have access to create this project authorization tokens"
    );
  }

  const dbToken = await prisma.authorizationToken.create({
    data: {
      projectId: props.projectId,
      relation: props.relation,
      token: tokenId,
      name: props.name,
    },
  });

  return dbToken;
};

export const update = async (
  projectId: Project["id"],
  props: Pick<AuthorizationToken, "token" | "relation"> &
    Partial<AuthorizationToken>,
  context: AppContext
) => {
  // Only owner of the project can edit authorization tokens
  const canCreateToken = await authorizeProject.hasProjectPermit(
    { projectId, permit: "own" },
    context
  );

  if (canCreateToken === false) {
    throw new AuthorizationError(
      "You don't have access to edit this project authorization tokens"
    );
  }

  const previousToken = await prisma.authorizationToken.findUnique({
    where: {
      // eslint-disable-next-line camelcase
      token_projectId: {
        projectId,
        token: props.token,
      },
    },
  });

  if (previousToken === null) {
    throw new AuthorizationError("Authorization token not found");
  }

  const dbToken = await prisma.authorizationToken.update({
    where: {
      // eslint-disable-next-line camelcase
      token_projectId: {
        projectId: projectId,
        token: props.token,
      },
    },
    data: {
      name: props.name,
      relation: props.relation,
      canClone: props.canClone,
      canCopy: props.canCopy,
    },
  });

  return dbToken;
};

export const remove = async (
  props: {
    projectId: Project["id"];
    token: AuthorizationToken["token"];
  },
  context: AppContext
) => {
  // Only owner of the project can delete authorization tokens
  const canDeleteToken = await authorizeProject.hasProjectPermit(
    { projectId: props.projectId, permit: "own" },
    context
  );

  if (canDeleteToken === false) {
    throw new Error(
      "You don't have access to delete this project authorization tokens"
    );
  }

  const dbToken = await prisma.authorizationToken.delete({
    where: {
      // eslint-disable-next-line camelcase
      token_projectId: {
        projectId: props.projectId,
        token: props.token,
      },
    },
  });

  return dbToken;
};
