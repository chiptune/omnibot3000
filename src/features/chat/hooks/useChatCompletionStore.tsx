import {create} from "zustand";

import {ChatCompletionMessageParam} from "openai/resources/index.mjs";

import {clamp} from "@utils/math";

import {getCompletionId, getRandomToken} from "@chat/commons/strings";

export type ChatId = string | undefined;

export interface Chat {
  id: ChatId;
  title: string;
  index: number;
}

export type CompletionId = string | undefined;

export type ParentId = ChatId | CompletionId;

export interface Completion {
  id: CompletionId;
  created: EpochTimeStamp;
  model: string;
  prompt: string;
  message: string;
  title: string;
  index: number;
  children: Completion[];
  parentId: ParentId;
}

export interface Data {
  chatId: ChatId;
  chats: Chat[];
  completions: Completion[];
}

export interface ChatCompletionStoreState {
  /* chats */
  chatId: ChatId;
  chats: Chat[];
  createChat: (completion: Completion) => void;
  readChat: (id: ChatId) => Chat | undefined;
  updateChat: (chat: Chat) => void;
  updateChatTitle: (id: ChatId, title: string) => void;
  deleteChat: (id: ChatId) => void;
  resetChat: () => void;
  loadChat: (id: ChatId) => void;
  /* completions */
  completions: Completion[];
  createCompletion: (
    id: string,
    created: number,
    model: string,
    query: string,
  ) => Completion;
  readCompletion: (id: CompletionId) => Completion | undefined;
  updateCompletion: (id: CompletionId, completion: Completion) => void;
  updateCompletionTitle: (id: CompletionId, title: string) => void;
  deleteCompletion: (id: CompletionId) => void;
  findCompletion: (id: CompletionId, index: number) => Completion | undefined;
  /* tools */
  getParent: (id: CompletionId) => Completion | Chat | undefined;
  getCompletions: (id: ParentId) => Completion[];
  updateIndex: (id: CompletionId, index: number) => void;
  readConversation: (id: ParentId) => Completion[];
  readMessages: (id: ParentId) => ChatCompletionMessageParam[];
  /* data */
  export: () => Data;
  import: (data: Data) => void;
}

const useChatCompletionStore = create<ChatCompletionStoreState>()(
  (set, get) => ({
    /* chats */
    chatId: undefined,
    chats: [],
    createChat: (completion: Completion) => {
      const chat: Chat = {
        id: getRandomToken(),
        title: "",
        index: 0,
      };
      get().chats.push(chat);
      set({chatId: chat.id});
      completion.parentId = chat.id;
      get().completions.push(completion);
    },
    readChat: (id?: ChatId): Chat | undefined =>
      get().chats.find((chat: Chat) => (id || get().chatId) === chat.id),
    updateChat: (chat: Chat) => {
      set({
        chats: get().chats.map((c: Chat) => (c.id === chat.id ? {...chat} : c)),
      });
    },
    updateChatTitle: (id: ChatId, title: string) => {
      const chat = get().readChat(id);
      if (!chat) return;
      chat.title = title;
      get().updateChat(chat);
    },
    deleteChat: (id?: ChatId) => {
      if (id === get().chatId) get().resetChat();
      set({
        chats: get().chats.filter(
          (chat: Chat) => chat.id !== (id || get().chatId),
        ),
        completions: get().completions.filter(
          (completion: Completion) =>
            completion.parentId !== (id || get().chatId),
        ),
      });
    },
    resetChat: () => {
      set({chatId: undefined});
    },
    loadChat: (id?: ChatId) => {
      const chat = get().readChat(id);
      if (!chat) return;
      set({chatId: chat.id});
    },
    /* completions */
    completions: [],
    createCompletion: (
      id: string,
      created: EpochTimeStamp,
      model: string,
      query: string,
    ): Completion => {
      const completion: Completion = {
        id: getCompletionId(id),
        created,
        model: model,
        prompt: query,
        message: "",
        title: "",
        index: 0,
        children: [],
        parentId: undefined,
      };
      return completion;
    },
    readCompletion: (id: CompletionId): Completion | undefined => {
      const queue: Completion[] = [...get().completions];
      let i = 0;
      while (i < queue.length) {
        const current = queue[i++];
        if (current.id === id) return current;
        if (current.children.length > 0) queue.push(...current.children);
      }
      return undefined;
    },
    updateCompletion: (id: ParentId, completion: Completion) => {
      const parent = get().getParent(id);
      if (!parent) return;
      completion.parentId = parent.id;
      if ("children" in parent) {
        parent.children.push(completion);
        parent.index = parent.children.length - 1;
      } else {
        get().completions.push(completion);
        parent.index =
          get().completions.filter((c) => c.parentId === parent.id).length - 1;
      }
    },
    updateCompletionTitle: (id: CompletionId, title: string) => {
      const completion = get().readCompletion(id);
      if (!completion) return;
      completion.title = title;
      set({completions: [...get().completions]});
    },
    deleteCompletion: (id?: CompletionId) => {
      const completion = get().readCompletion(id);
      if (!completion) return;
      const parent = get().getParent(completion.parentId);
      const completions = get().completions.filter(
        (c) => c.id !== completion.id,
      );
      set({completions: [...completions]});
      /* delete the chat if the deleted completion is the last one */
      if (completions.length === 0) get().deleteChat(completion.parentId);
      if (!parent) return;
      if ("children" in parent) {
        parent.children = parent.children.filter((c) => c.id !== id);
      }
      get().updateIndex(parent.id, parent.index - 1);
    },
    findCompletion: (
      id: CompletionId,
      index: number,
    ): Completion | undefined => {
      const completion = get().readCompletion(id);
      if (!completion) return;
      const parent = get().getParent(completion.parentId);
      if (!parent) return;
      return get()
        .getCompletions(parent.id)
        .filter((c) => c.parentId === parent.id)[index];
    },
    /* tools */
    getParent: (id?: ParentId): Completion | Chat | undefined =>
      get().readCompletion(id) || get().readChat(id),
    getCompletions: (id?: ParentId): Completion[] => {
      let completions: Completion[] = [];
      const parent = get().getParent(id);
      if (!parent) return completions;
      if ("children" in parent) completions = parent.children;
      else
        completions = completions.concat(
          get().completions.filter((c) => c.parentId === parent.id),
        );
      return completions.sort((a, b) => a.created - b.created);
    },
    updateIndex: (id: ParentId, index: number) => {
      const parent = get().getParent(id);
      if (!parent) return;
      const completions = get().getCompletions(parent.id);
      parent.index = clamp(index, 0, completions.length - 1);
      const conversation = get().readConversation(get().chatId);
      get().updateChatTitle(
        get().chatId,
        conversation[conversation.length - 1]?.title || "",
      );
    },
    readConversation: (id: ParentId): Completion[] => {
      const conversation: Completion[] = [];
      const chat = get().readChat(id);
      if (!chat) return [];
      const completions = get()
        .completions.filter((c) => c.parentId === chat.id)
        .sort((a, b) => a.created - b.created);
      let current = completions[clamp(chat.index, 0, completions.length - 1)];
      if (!current) return [];
      conversation.push(current);
      if (!current?.children) return conversation;
      while (current.children.length > 0) {
        current =
          current.children[
            clamp(current.index, 0, current.children.length - 1)
          ];
        conversation.push(current);
      }
      return conversation;
    },
    readMessages: (id: ParentId): ChatCompletionMessageParam[] =>
      get()
        .readConversation(id)
        .map((completion: Completion) => {
          return [
            {role: "user", content: completion.prompt},
            {role: "assistant", content: completion.message},
          ];
        })
        .flat(Infinity) as ChatCompletionMessageParam[],
    /* data */
    export: (): Data => {
      return {
        chatId:
          get().chats.find((chat: Chat) => Boolean(chat.id === get().chatId))
            ?.id || undefined,
        chats: get().chats,
        completions: get().completions.filter((completion: Completion) =>
          Boolean(
            get().chats.find((chat: Chat) =>
              Boolean(chat.id === completion.parentId),
            ),
          ),
        ),
      };
    },
    import: (data: Data) => {
      set({
        chatId: data.chatId,
        chats: [...data.chats],
        completions: [...data.completions],
      });
    },
  }),
);

export default useChatCompletionStore;
