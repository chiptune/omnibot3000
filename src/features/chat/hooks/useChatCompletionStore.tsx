import {create} from "zustand";

import {COMPLETION_MAX_TOKENS} from "@commons/constants";

import {formatChatId} from "@chat/commons/strings";
import {ChatCompletionMessageParam} from "openai/resources/index.mjs";

export interface ChatSettings {
  maxTokens: number;
}

export type ChatId = string | undefined;

export interface Chat {
  id: ChatId;
  title: string;
  created: EpochTimeStamp;
  completions: Completion[];
  lastCompletion: CompletionId;
}

export type CompletionId = string;

export interface Completion {
  id: CompletionId;
  created: EpochTimeStamp;
  model: string;
  prompt: string;
  message: string;
  previousCompletion: CompletionId | undefined;
}

export interface Data {
  chats: Chat[];
}

export interface ChatCompletionStoreState {
  settings: ChatSettings;
  getSettings: () => ChatSettings;
  setSetting: (key: string, value: number | string | boolean) => void;
  chatId: ChatId;
  setChatId: (id: ChatId) => void;
  resetChatId: () => void;
  getChatId: () => ChatId;
  chats: Chat[];
  createChat: (completion: Completion) => void;
  getChats: () => Chat[];
  getChat: (id?: ChatId) => Chat | undefined;
  removeChat: (id?: ChatId) => void;
  updateChatTitle: (id: ChatId, title: string) => void;
  completions: Completion[];
  setCompletions: (id: ChatId) => void;
  addCompletion: (completion: Completion) => void;
  getCompletions: (id: ChatId) => Completion[];
  getCompletion: (id: CompletionId) => Completion | undefined;
  updateCompletions: (id: ChatId) => void;
  resetCompletions: () => void;
  messages: ChatCompletionMessageParam[];
  getMessages: (id: ChatId) => ChatCompletionMessageParam[];
  exportData: () => Data;
  importData: (data: Data) => void;
}

const useChatCompletionStore = create<ChatCompletionStoreState>()(
  (set, get) => ({
    settings: {maxTokens: COMPLETION_MAX_TOKENS},
    getSettings: () => get().settings,
    setSetting: (key: string, value: number | string | boolean) =>
      set((state) => ({
        settings: {...state.settings, [key]: value},
      })),
    chatId: undefined,
    setChatId: (id: ChatId) => set({chatId: formatChatId(id)}),
    resetChatId: () => set({chatId: undefined}),
    getChatId: () => get().chatId,
    chats: [],
    createChat: (completion: Completion) =>
      set((state) => ({
        chatId: formatChatId(completion.id),
        chats: [
          ...state.chats,
          {
            id: formatChatId(completion.id),
            title: "",
            created: completion.created, //new Date().getTime(),
            completions: [completion],
            lastCompletion: completion.id,
          },
        ],
      })),
    getChats: () => get().chats,
    getChat: (id?: ChatId) =>
      get().chats.find((chat: Chat) => Boolean(id === chat.id)),
    removeChat: (id?: ChatId) => {
      const index = get().chats.findIndex((chat: Chat) => id === chat.id);
      if (index !== -1) {
        const updatedChats = [...get().chats];
        updatedChats.splice(index, 1);
        set(() => ({chats: updatedChats}));
      }
    },
    updateChatTitle: (id: ChatId, title: string) => {
      const updatedChats: Chat[] = get().chats.map(
        (chat: Chat): Chat => (chat.id === id ? {...chat, title} : chat),
      );
      set({chats: updatedChats});
    },
    completions: [],
    setCompletions: (id: ChatId) =>
      set(() => ({
        completions: [...get().getCompletions(id)],
      })),
    addCompletion: (completion: Completion) =>
      set((state) => ({
        completions: [...state.completions, completion],
      })),
    getCompletions: (id: ChatId) => get().getChat(id)?.completions || [],
    getCompletion: (id: CompletionId) =>
      get().completions.find((completion: Completion) => completion.id === id),
    updateCompletions: (id: ChatId) => {
      const updatedChats: Chat[] = get().chats.map(
        (chat: Chat): Chat =>
          chat.id === id ? {...chat, completions: get().completions} : chat,
      );
      set({chats: updatedChats});
    },
    resetCompletions: () =>
      set(() => ({
        completions: [],
      })),
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
