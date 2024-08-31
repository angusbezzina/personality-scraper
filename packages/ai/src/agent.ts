import { DynamicStructuredTool } from "@langchain/community/tools/dynamic";
import { type AIMessage, type BaseMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { END, MemorySaver, START, StateGraph, type StateGraphArgs } from "@langchain/langgraph/web";

import { slugify } from "@personality-scraper/common/slugify";
import type { z } from "@personality-scraper/common/validation";
import { FileStorage } from "@personality-scraper/services";
import { type PersonalityScraper } from "@personality-scraper/types";

import { gpt } from "./models";
import { PerplexitySchema, YouTubeKnowledgeSchema } from "./schemas";

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

There are four specific tasks that you are responsible for here. Please work through them in order and complete them exactly as instructed.

## Task 1: Search for additional relevant information about the creator. 
Using Perplexity, retrieve any additional relevant information about the creator.

## Task 2: Add entries to the Knowledge Base.
1. For any source of background information that the user provides, separate the information into distinct entities such as posts, videos or articles.
2. For every entity identified, generate an entry for a communal "Knowledge Base" that Synthflow can refer back to later to enhance the audio clone.
   Every entry for the knowledge base should include the following:
   * The title of the entity.
   * A description of what the entity is about.
   * The key topics or themes of the entity.
   * The key takeaways or lessons learned from the entity.
   * Potential questions that a user may ask that are related to the content of the entity and responses to those questions in the style and tone of the creator.
3. Add every Knowledge Base entry that you have generated to the Knowledge Base using the tools at your desposal.

## Task 3: Construct a personality profile.
Construct a personality profile from all of the information that you have about the creator. Ensure you make note of these particular points:
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

## Task 4: Write a prompt that will be used to generate the audio clone on Synthflow.
Using all of the information that you have gathered so far, write a prompt that will be used to generate the audio clone on Synthflow.
Use the following template to structure your prompt:
<promptTemplate>
  ## Personality Profile
  - A detailed description of the personality profile created in Task 3.

  ## Personality Traits
  - List of up to 15 personality traits that are most indicative of this person.

  ## Demeanor and Communication Style
  - Describe how the person carries themselves in conversations and how they communicate to others.
  - This description should include up to 10 distinct adjectives that accurately reflect the person's communications style.
  - Also note any significant intonations, inflections and other nuances in the how the person speaks.

  ## Philosophy and Views
  - List the persons philosophies and ideals.

  ## Knowledge Base Entries
  - List the titles of all of the Knowledge Base entries that you generated in Task 2.

  ## Sample Interactions
  - Using the questions and answers from the Knowledge Base entries, take up to 20 sample interactions that are the most representative of the creator. 
  
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
}: PersonalityCreationPrompt): Promise<PersonalityScraper.PersonalityPromptOutput> {
  const knowledgeBaseEntries: PersonalityScraper.KnowledgeBase[] = [];
  const knowledgeBasePaths: PersonalityScraper.Path[] = [];

  // Model
  const llm = gpt();

  // Tools
  const addYouTubeKnowledge = new DynamicStructuredTool({
    name: "add_youtube_knowledge",
    description: "Pass knowledge gathered from YouTube to the knowledge base",
    schema: YouTubeKnowledgeSchema,
    func: async ({ knowledge }: z.infer<typeof YouTubeKnowledgeSchema>) => {
      const { title, description, topics, takeaways, questions } = knowledge;
      knowledgeBaseEntries.push(knowledge);
      const fileOutput = `
        # ${title}

        ## Description
        ${description}

        ## Topics
        ${topics.join("\n")}

        ## Takeaways
        ${takeaways.join("\n")}

        ## Questions
        ${questions
          .map(
            ({ question, response }) => `
          #### ${question}
          ${response}
        `,
          )
          .join("\n")}
      `;

      const file = Buffer.from(fileOutput);
      const path = `${slugify(knowledge.title)}.txt` as PersonalityScraper.Path;

      try {
        await FileStorage.uploadFile(path, file);

        knowledgeBasePaths.push(path);
      } catch (error) {
        console.error("Failed to upload knowledge base file to S3");
      }

      return "";
    },
  });

  const searchPerplexity = new DynamicStructuredTool({
    name: "search_perplexity",
    description: "Uses a search engine to find additional relevant information about the creator",
    schema: PerplexitySchema,
    func: async ({ name }: z.infer<typeof PerplexitySchema>) => {
      // TODO: Angus to implement...
      return `No more information found for ${name}`;
    },
  });

  // TODO: Scrape context for Podcasts...
  // TODO: Scrape context for Instagram...
  // TODO: Scrape context for Twitter...

  const tools = [addYouTubeKnowledge, searchPerplexity] as any[];

  const { youtube } = rag;

  const formattedRag = `<youtubeData>${youtube}</youtubeData>`;

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

  const lastMessage = finalState.messages[finalState.messages.length - 1].content;

  if (!lastMessage) {
    throw new Error("No prompt generated");
  }

  return { prompt: lastMessage, knowledgeBase: knowledgeBasePaths };
}
