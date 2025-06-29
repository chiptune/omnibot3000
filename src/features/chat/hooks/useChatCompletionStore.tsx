import {create} from "zustand";

import {COMPLETION_MAX_TOKENS} from "@commons/constants";

import {formatCompletionId} from "@chat/commons/strings";
import {ChatCompletionMessageParam} from "openai/resources/index.mjs";

export interface ChatSettings {
  maxTokens: number;
}

export type ChatId = string | undefined;

export interface Chat {
  id: ChatId;
  title: string;
  created: EpochTimeStamp;
  index: number;
  completions: Completion[];
}

export type CompletionId = string | undefined;

export interface Completion {
  id: CompletionId;
  created: EpochTimeStamp;
  model: string;
  prompt: string;
  message: string;
  index: number;
  children: Completion[];
  parentCompletion: CompletionId | undefined;
}

export interface Data {
  chats: Chat[];
}

export interface ChatCompletionStoreState {
  settings: ChatSettings;
  setSetting: (key: string, value: number | string | boolean) => void;
  getSettings: () => ChatSettings;
  chatId: ChatId;
  setChatId: (id?: ChatId) => void;
  getChatId: () => ChatId;
  chats: Chat[];
  createChat: (completion: Completion) => void;
  getChats: () => Chat[];
  getChat: (id?: ChatId) => Chat | undefined;
  updateChatTitle: (id: ChatId, title: string) => void;
  deleteChat: (id?: ChatId) => void;
  completionId: CompletionId;
  setCompletionId: (id?: CompletionId) => void;
  getCompletionId: () => CompletionId;
  completions: Completion[];
  getCompletions: (id: ChatId) => Completion[];
  setCompletions: (id?: ChatId) => void;
  getCompletion: (id: CompletionId) => Completion | undefined;
  addCompletion: (completion: Completion) => void;
  updateCompletions: (id: ChatId) => void;
  deleteCompletion: (id: CompletionId) => void;
  messages: ChatCompletionMessageParam[];
  getMessages: (id: ChatId) => ChatCompletionMessageParam[];
  exportData: () => Data;
  importData: (data: Data) => void;
}

const useChatCompletionStore = create<ChatCompletionStoreState>()(
  (set, get) => ({
    settings: {maxTokens: COMPLETION_MAX_TOKENS},
    setSetting: (key: string, value: number | string | boolean) =>
      set((state) => ({
        settings: {...state.settings, [key]: value},
      })),
    getSettings: () => get().settings,
    chatId: undefined,
    setChatId: (id?: ChatId) => set({chatId: id}),
    getChatId: () => get().chatId,
    chats: [],
    createChat: (completion: Completion) => {
      const id = formatCompletionId(completion.id);
      set((state) => ({
        chatId: id,
        completionId: id,
        chats: [
          ...state.chats,
          {
            id,
            title: "",
            created: completion.created, //new Date().getTime(),
            index: 0,
            completions: [completion],
          },
        ],
      }));
    },
    getChats: () => get().chats,
    getChat: (id?: ChatId) =>
      get().chats.find((chat: Chat) => Boolean(id === chat.id)),
    updateChatTitle: (id: ChatId, title: string) => {
      const updatedChats: Chat[] = get().chats.map(
        (chat: Chat): Chat => (chat.id === id ? {...chat, title} : chat),
      );
      set({chats: updatedChats});
    },
    deleteChat: (id?: ChatId) => {
      const index = get().chats.findIndex((chat: Chat) => id === chat.id);
      if (index !== -1) {
        const updatedChats = [...get().chats];
        updatedChats.splice(index, 1);
        set(() => ({chats: updatedChats}));
      }
    },
    completionId: undefined,
    setCompletionId: (id?: CompletionId) => set({completionId: id}),
    getCompletionId: () => get().completionId,
    completions: [],
    getCompletions: (id: ChatId) => get().getChat(id)?.completions || [],
    setCompletions: (id?: ChatId) =>
      set(() => ({
        completions: id ? [...get().getCompletions(id)] : [],
      })),
    getCompletion: (id: CompletionId) =>
      get().completions.find((completion: Completion) => completion.id === id),
    addCompletion: (completion: Completion) =>
      set((state) => ({
        completions: [...state.completions, completion],
      })),
    updateCompletions: (id: ChatId) => {
      const updatedChats: Chat[] = get().chats.map(
        (chat: Chat): Chat =>
          chat.id === id ? {...chat, completions: get().completions} : chat,
      );
      set({chats: updatedChats});
    },
    deleteCompletion: (id: CompletionId) => {
      const completion = get().getCompletion(id);
      if (!completion) return;
      const parent = get().getCompletion(completion.parentCompletion || "");
      if (!parent) return;
      parent.children.splice(completion.index, 1);
    },
    messages: [],
    getMessages: (id: ChatId) =>
      get()
        .getCompletions(id)
        .map((completion: Completion) => {
          return [
            {role: "user", content: completion.prompt},
            {role: "assistant", content: completion.message},
          ];
        })
        .flat(Infinity) as ChatCompletionMessageParam[],
    exportData: (): Data => {
      return {
        chats: get().chats,
      };
    },
    importData: (data: Data) => {
      set(() => ({
        chats: [...data.chats],
      }));
    },
  }),
);

export default useChatCompletionStore;
