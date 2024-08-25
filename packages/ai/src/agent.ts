import type { Tool } from "langchain/tools";
import { type AIMessage, type BaseMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { END, MemorySaver, START, StateGraph, type StateGraphArgs } from "@langchain/langgraph/web";

import { type PersonalityScraper } from "@personality-scraper/types";

import { gpt } from "./models";

export type PersonalityCreationPrompt = {
  name: string;
  rag: PersonalityScraper.SocialData;
  strategy?: string;
};

interface AgentState {
  messages: BaseMessage[];
}

const SYSTEM_PROMPT = `
Your role is to serve as a prompt engineer specialising in writing prompts that are used to generate hyper-realistic audio clones of influencers and creators using Synthflow.

Synthflow is a service that creates AI voice assistants using prompts and audio clips.

Users will provide you with the name as well as background information that has been scraped from social media platforms of a creator for whom they want to create an audio clone.

Your responsibility to generate the prompt that Synthflow will use to create that audio clone, following these steps EXACTLY:
1. Construct a personality profile from background information that is provided. Ensure you take note of these particular points:
* Personal background, including age, gender, nationality, ethnic background, education, pivotal life events and any known family members or close friends.
* Personality traits - outline up to 10 of the most distinctive traits that describe this person.
* Demeanor - how this person communicates.
* Life perspectives - philosophy, ideals, values, goals, and any other significant aspects of their life.
* Commonly used expressions - slang, grammar, and any other common ways the person speaks that are distinctive.
* Hobbies and interests - hobbies, interests, and any other significant aspects of their life.
* Favourite stories - list at least 5 personal stories that appear repeatedly in the scraped content.
* Preferred metaphors and analogies - at least 10 metaphors and/or analogies that the person uses more than once to convey their points and ideas.
* Practical frameworks - Ideologies, paradigms or strategies that the person implements or refers back to frequently in their content.
* Tonality, Inflection, Voice modulation or any other distinctive aspects of the person's speech/communication.

2. Use the personality profile and any additional information you think is relevant to construct a prompt that will be used to generate the audio clone.
Use the following template to structure your prompt:
<promptTemplate>
  ## Background
  - A brief summary of the person and their background.

  ## Personality Traits
  - List of up to 15 personality traits that are most indicative of this person.

  ## Demeanor and Communication Style
  - Describe how the person carries themselves in conversations and how they communicate to others.
  - This description should include up to 10 distinct adjectives that accurately reflect the person's communications style.
  - Also note any significant intonations, inflections and other nuances in the how the person speaks.

  ## Philosophy and Views
  - List the persons philosophies and ideals.

  ## Sample Interactions
  - Identify and extract the 20 sample interactions from the scraped content that is the most representative of the person. 
  - These should be literal quotations from transcripts provided and should demonstrate how the person communicates on specific topics.
  
  ## Common words and phrases:
  - Create a list of the most commonly used words, phrases or expressions by this person.

  ## Metaphors and Analogies:
  - Create a list of metaphors and analogies that the person uses frequently in their content alongside explanations of how they are used.

  ## Practical Frameworks:
  - Create a list of the most common frameworks that the person implements or refers back to frequently in their content.

  ## Conversational Purpose and Strategy:
  - Summarise the conversational strategy that the user provides into a clear set of instructions for how this audio clone should direct/influence conversations. 
</promptTemplate>
IMPORTANT: the above template is a guide ONLY. You should not repeat any elements other than the headings directly from this in your response.
IMPORTANT: be as thorough and detailed as possible in your prompt.

Lastly, ONLY return the prompt you create, do not explain or converse with the user.
`;

export async function createPersonalityPrompt({
  name,
  rag,
  strategy,
}: PersonalityCreationPrompt): Promise<string | undefined> {
  // Model
  const llm = gpt();

  // Tools

  // NOTE: Example tool structure...
  // const scrapeYouTube = new DynamicStructuredTool({
  //   name: "scrape_youtube",
  //   description: "Gathers a list of transcripts from YouTube videos for a specific user",
  //   schema: YouTubeSchema,
  //   func: async ({ handle }: z.infer<typeof YouTubeSchema>) => {
  //     const transcripts = await getYoutubeTranscripts(handle);

  //     return transcripts.map((item) => JSON.stringify(item)).join(", ");
  //   },
  // });

  // TODO: Scrape context with Perplexity...
  // TODO: Scrape context for Podcasts...
  // TODO: Scrape context for Twitter...

  const tools: Tool[] = [];

  const { youtube } = rag;

  const formattedRag = `<youtubeTranscripts>${youtube}</youtubeTranscripts>`;

  const userPrompt = `Please create a prompt for an audio clone for ${name}. Use the following background information in the generation of your prompt: <background>${formattedRag}<background>.${strategy ? `Please also note that the conversational strategy should be: ${strategy}` : ""}`;

  const graphState: StateGraphArgs<AgentState>["channels"] = {
    messages: {
      reducer: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    },
  };

  const prompt = [
    ["system", SYSTEM_PROMPT],
    ["human", userPrompt],
  ];

  const model = llm.bindTools(tools);
  const toolNode = new ToolNode<AgentState>(tools);

  function route(state: AgentState) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    if (lastMessage.tool_calls?.length) {
      return "tools";
    }

    return END;
  }

  async function callModel(state: AgentState) {
    const messages = state.messages;
    const response = await model.invoke(messages);

    return { messages: [response] };
  }

  const workflow = new StateGraph<AgentState>({ channels: graphState })
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", route)
    .addEdge("tools", "agent");

  // TODO: If we want to add memory, use the commented out code below
  // const checkpointer = new MemorySaver();
  // const app = workflow.compile({ checkpointer });

  const app = workflow.compile();

  const finalState = await app.invoke({
    messages: prompt,
  });

  console.log("SYSTEM PROMPT", SYSTEM_PROMPT);
  console.log("USER PROMPT", userPrompt);
  console.log("FINAL STATE", finalState);
  const lastMessage = finalState.messages[finalState.messages.length - 1].content;

  return lastMessage;
}
