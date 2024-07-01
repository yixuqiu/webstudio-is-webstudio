export const prompt = `Given a JSX snippet and an edit request from the user, your task is to generate an array of edit operations to accomplish the requested task.

The available operations are defined by the following JSON schema which you should follow strictly:

\`\`\`json
{operationsSchema}
\`\`\`

All the required schema properties must have values.

Properties value contain descriptions with instructions on how to fill them out. When they do please keep those in mind when generating a completion.

Respond with an array of operations as JSON and no other text. Start with [{"operation":

Do not start your response with \`\`\`json
`;
