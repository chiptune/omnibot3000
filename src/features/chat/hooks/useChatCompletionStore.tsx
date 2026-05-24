import {create} from "zustand";

import {ChatCompletionMessageParam} from "openai/resources/index.mjs";

//import {clamp} from "@utils/math";
import {getCompletionId, getRandomToken} from "@chat/commons/strings";

export type ChatId = string | undefined;

export interface Chat {
  id: ChatId;
  title: string;
  index: number;
}

export type CompletionId = string | undefined;

export interface Completion {
  id: CompletionId;
  created: EpochTimeStamp;
  model: string;
  prompt: string;
  message: string;
  title: string;
  index: number;
  children: Completion[];
  parentId: CompletionId;
}

export interface Data {
  chatId: ChatId;
  chats: Chat[];
  completionId: CompletionId;
  completions: Completion[];
}

export interface ChatCompletionStoreState {
  /* chats */
  chatId: ChatId;
  chats: Chat[];
  createChat: (completion: Completion) => void;
  readChat: (id?: ChatId) => Chat | undefined;
  updateChat: (chat: Chat) => void;
  updateChatTitle: (title: string, id?: ChatId) => void;
  deleteChat: (id?: ChatId) => void;
  resetChat: () => void;
  loadChat: (id?: ChatId) => void;
  /* completions */
  completionId: CompletionId;
  completions: Completion[];
  createCompletion: (
    id: string,
    created: number,
    model: string,
    query: string,
  ) => Completion;
  readCompletion: (id?: CompletionId) => Completion | undefined;
  updateCompletion: (completion: Completion, id?: CompletionId) => void;
  updateCompletionTitle: (title: string, id?: CompletionId) => void;
  deleteCompletion: (id?: CompletionId) => void;
  findCompletion: (id: CompletionId, index: number) => Completion | undefined;
  /* tools */
  getParent: (id?: CompletionId) => Completion | Chat | undefined;
  readConversation: (id?: ChatId) => Completion[];
  readMessages: (id?: ChatId) => ChatCompletionMessageParam[];
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
      set({chatId: chat.id, completionId: completion.id});
      completion.parentId = chat.id;
      get().completions.push(completion);
    },
    readChat: (id?: ChatId): Chat | undefined =>
      get().chats.find((chat: Chat) =>
        Boolean((id || get().chatId) === chat.id),
      ),
    updateChat: (chat: Chat) => {
      set({
        chats: get().chats.map((c: Chat) => (c.id === chat.id ? {...chat} : c)),
      });
    },
    updateChatTitle: (title: string, id?: ChatId) => {
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
      set({
        chatId: undefined,
        completionId: undefined,
      });
    },
    loadChat: (id?: ChatId) => {
      const chat = get().readChat(id);
      if (!chat) return;
      set({
        chatId: chat.id,
        completionId:
          get().completions.find((completion) =>
            Boolean(completion.parentId === chat.id),
          )?.id || undefined,
      });
    },
    /* completions */
    completionId: undefined,
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
    readCompletion: (id?: CompletionId): Completion | undefined => {
      const completionId = id || get().completionId;
      const queue: Completion[] = [...get().completions];
      let i = 0;
      while (i < queue.length) {
        const current = queue[i++];
        if (current.id === completionId) return current;
        if (current.children.length > 0) queue.push(...current.children);
      }
      return undefined;
    },
    updateCompletion: (completion: Completion, id?: CompletionId) => {
      const parent = get().readCompletion(id);
      if (parent) {
        completion.parentId = parent.id;
        parent.children.push(completion);
        parent.index = parent.children.length - 1;
      } else if (get().chatId) {
        const chat = get().readChat();
        if (!chat) return;
        completion.parentId = chat.id;
        get().completions.push(completion);
        chat.index =
          get().completions.filter((c) => c.parentId === chat.id).length - 1;
      } else return;
      set({completionId: completion.id});
    },
    updateCompletionTitle: (title: string, id?: CompletionId) => {
      const completion = get().readCompletion(id);
      if (!completion) return;
      completion.title = title;
      set({completions: [...get().completions]});
    },
    deleteCompletion: (id?: CompletionId) => {
      const completion = get().readCompletion(id);
      if (!completion) return;
      const parent = get().readCompletion(completion.parentId);
      if (parent) {
        parent.children = parent.children.filter((c) => c.id !== completion.id);
        parent.index = parent.children.length - 1;
        set({
          completionId: parent.id,
          completions: [...get().completions],
        });
      } else if (get().completions.length > 0) {
        set({
          completionId: undefined,
          completions: get().completions.filter((c) => c.id !== completion.id),
        });
      }
    },
    getParent: (id?: CompletionId): Completion | Chat | undefined => {
      const completion = get().readCompletion(id);
      if (!completion) return;
      const parent =
        get().readCompletion(completion.parentId) ||
        get().readChat(completion.parentId);
      return parent;
    },
    findCompletion: (
      id: CompletionId,
      index: number,
    ): Completion | undefined => {
      const parent = get().getParent(id);
      if (!parent || !("children" in parent)) return;
      return parent.children && parent.children?.[index];
    },
    /* tools */
    readConversation: (id?: ChatId): Completion[] => {
      const conversation: Completion[] = [];
      let current = get().completions.find((completion) =>
        Boolean(completion.parentId === (id || get().chatId)),
      );
      if (!current) return [];
      conversation.push(current);
      if (!current?.children) return conversation;
      while (current.children.length > 0) {
        current = current.children[current.index ?? 0];
        conversation.push(current);
      }
      return conversation;
    },
    readMessages: (): ChatCompletionMessageParam[] =>
      get()
        .readConversation()
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
        completionId:
          get().completions.find((completion: Completion) =>
            Boolean(completion.id === get().completionId),
          )?.id || undefined,
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
        completionId: data.completionId,
        completions: [...data.completions],
      });
    },
  }),
);

export default useChatCompletionStore;

/*
    updateChat: (newChat: Chat) => {
      const updatedChats: Chat[] = get().chats.map(
        (chat: Chat): Chat => (chat.id === newChat.id ? {...newChat} : chat),
      );
      set({chats: updatedChats});
      get().setConversation();
      get().setMessages();
    },
    updateChatTitle: (title: string, id?: ChatId) => {
      const chat = get().getChat(id);
      if (!chat) return;
      chat.title = title;
      get().updateChat(chat);
    },
    loadChat: (id?: ChatId) => {
      const chat = get().getChat(id);
      if (!chat) return;
      set({
        chatId: chat.id,
        chat,
        completions: chat.completions,
      });
      const completion = get().getCompletion(get().getCompletionId());
      if (completion) set({completionId: completion.id, completion});
      get().setConversation();
      get().setMessages();
      console.info(get().chatId);
      console.info(get().chat);
      console.info(get().completions);
      console.info(get().completionId);
      console.info(get().completion);
      console.info(get().conversation);
      console.info(get().messages);
    },
    deleteChat: (id?: ChatId) => {
      const index = get().chats.findIndex((chat: Chat) => id === chat.id);
      if (index === -1) return;
      const updatedChats = [...get().chats];
      updatedChats.splice(index, 1);
      get().setChats(updatedChats);
      get().resetChat();
    },
    resetChat: () => {
      set({
        completionId: undefined,
        completion: undefined,
        completions: [],
        chatId: undefined,
        chat: undefined,
        conversation: [],
        messages: [],
      });
    },
    chats: [],
    getChats: () => get().chats,
    setChats: (chats?: Chat[]) => set({chats}),
    completionId: undefined,
    setCompletionId: (id?: CompletionId) => set({completionId: id}),
    getCompletionId: () => {
      const completions = get().completions;
      if (!completions.length) return;
      let current = completions[get().chat?.index ?? completions.length - 1];
      if (!current?.children) return;
      while (current.children.length > 0)
        current =
          current.children[current.index ?? current.children.length - 1];
      return current.id;
    },
    completion: undefined,
    setCompletion: (completion?: Completion) => set({completion}),
    appendCompletion: () => {
      const completion = get().completion;
      if (!completion) return;
      if (completion.parentId) {
        const parent = get().getCompletion(completion.parentId);
        if (!parent) return;
        console.info("append completion to", parent.id);
        completion.parentId = parent.id;
        parent.children.push(completion);
        parent.index = parent.children.length - 1;
      } else {
        const chat = get().getChat();
        if (!chat) return;
        console.info("append completion to", chat.id);
        completion.parentId = undefined;
        chat.completions.push(completion);
        chat.index = chat.completions.length - 1;
      }
      set({completionId: completion.id, completion});
    },
    loadCompletion: (id?: CompletionId) => {
      const completion = get().getCompletion(id);
      if (!completion) return;
      set({completionId: completion.id, completion});
      get().setConversation();
      get().setMessages();
    },
    deleteCompletion: (id?: CompletionId) => {
      const completion = get().getCompletion(id);
      if (!completion) return;
      const parent = get().getCompletion(completion.parentId);
      if (parent) {
        parent.children = parent.children.filter((c) => c.id !== completion.id);
        parent.index = parent.children.length - 1;
        set({
          completionId: parent.id,
          completion: parent,
          completions: [...get().completions],
        });
      } else if (get().completions.length > 0) {
        set({
          completions: get().completions.filter((c) => c.id !== completion.id),
        });
      }
    },
    setCompletionIndex: (id?: CompletionId, index?: number) => {
      const completion = get().getCompletion(id);
      if (!completion) return;
      completion.index = clamp(index, 0, completion.children.length - 1);
      get().loadCompletion(completion.id);
    },
    completions: [],
    setCompletions: (id?: ChatId) =>
      set({completions: get().getCompletions(id)}),
    getCompletions: (id?: ChatId) => get().getChat(id)?.completions || [],
    updateCompletions: (id?: ChatId) => {
      const chat = get().getChat(id);
      if (!chat) return;
      get().updateChat({...chat, completions: get().completions});
    },
    conversation: [],
    setConversation: (id?: ChatId) =>
      set({conversation: get().getConversation(id)}),
    messages: [],
    setMessages: (id?: ChatId) => set({messages: get().getMessages(id)}),
    getMessages: (id?: ChatId) =>
*/
