import {
  handleWebSearch,
} from "./webSearchAgent.js";

import {
  academicSearchAgentStream,
} from "./academicSearchAgentStream.js";

import {
  handleRedditSearch,
} from "./redditSearchAgent.js";

import {
  videoSearchAgent,
} from "./videoSearchAgent.js";

import {
  imageSearchAgent,
} from "./imageSearchAgent.js";

import {
  writingAssistant,
} from "./writingAssistantAgent.js";

export const agentDispatcher = {
  academic: academicSearchAgentStream,
  reddit: handleRedditSearch,
  web: handleWebSearch,
  youtube: videoSearchAgent,
  image: imageSearchAgent,
  writing: writingAssistant,
} as const;

export type AgentMode =
  keyof typeof agentDispatcher;
  