import { type AIMessage, type BaseMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { END, MemorySaver, START, StateGraph, type StateGraphArgs } from "@langchain/langgraph/web";

import { z } from "@personality-scraper/common/validation";
import { getYoutubeTranscripts } from "@personality-scraper/scrape";
import { type PersonalityScraper } from "@personality-scraper/types";

import { gpt } from "./models";
import { YouTubeSchema } from "./schemas";

export type PersonalityCreationPrompt = {
  name: string;
  socials: PersonalityScraper.SocialInput;
  strategy?: string;
  additionalContext?: string[][]; // More RAG content...
}

interface AgentState {
  messages: BaseMessage[];
}

const SYSTEM_PROMPT =
`
Your role is to serve as a prompt engineer specialising in writing prompts that are used to generate hyper-realistic audio clones of influencers and creators using Synthflow.

Synthflow is a service that creates AI voice assistants using prompts and audio clips.

Users will provide you with the name and social media handles of a creator for whom they want to create an audio clone.

Your responsibility to generate the prompt that Synthflow will use to create that audio clone, following these steps EXACTLY:
1. Take the social media handles from the JSON input the user provides and scrape the associated platform for information about the user using the helper tools provided.

2. Construct a personality profile from the information that is returned from the social media accounts that have been scraped. Ensure you take note of these particular points:
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

3. Use the personality profile and any additional information you think is relevant to construct a prompt that will be used to generate the audio clone.
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
  socials: rawSocials,
  strategy,
  additionalContext
}: PersonalityCreationPrompt): Promise<string | undefined> {
  // Model
  const llm = gpt();

  // Tools
    const scrapeYouTube = new DynamicStructuredTool({
      name: "scrape_youtube",
      description: "Gathers a list of transcripts from YouTube videos for a specific user",
      schema: YouTubeSchema,
      func: async ({ handle }: z.infer<typeof YouTubeSchema>) => {
        const transcripts = await getYoutubeTranscripts(handle);


        return transcripts.map((item) => JSON.stringify(item)).join(", ");
      },
    });

  // TODO: Scrape context with Perplexity...
  // TODO: Scrape context for Podcasts...
  // TODO: Scrape context for Twitter...

  const tools = [scrapeYouTube];

  const socials = JSON.stringify(rawSocials);

  const userPrompt = `Please create an audio clone for ${name}. Their social media accounts are: ${JSON.stringify(socials)}.${ strategy ? `The conversational strategy is ${strategy}` : ""}`;

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
  const lastMessage = finalState.messages[finalState.messages.length - 1].content

  return lastMessage;
}
