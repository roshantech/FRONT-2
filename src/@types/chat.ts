// ----------------------------------------------------------------------

export type IChatAttachment = {
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  dateCreated: Date;
  dateModified: Date;
};

export type IChatTextMessage = {
  id: string;
  body: string;
  contentType: 'text';
  attachments: IChatAttachment[];
  createdAt: Date;
  senderId: string;
};

export type IChatImageMessage = {
  id: string;
  body: string;
  contentType: 'image';
  attachments: IChatAttachment[];
  createdAt: Date;
  senderId: string;
};

export type IChatMessage = {
  ID: number;
  UpdatedAt: string;
  DeletedAt: string | null;
  ConversationID: string;
  Body: string;
  ContentType: string;
  Attachments: any[]; // Change this type accordingly based on the actual structure
  CreatedAt: string;
  SenderID: number;
};

// ----------------------------------------------------------------------

export type IChatContact = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  address: string;
  phone: string;
  email: string;
  lastActivity: Date | string | number;
  status: string;
  role: string;
};

export type IChatParticipant = {
  ID: number;
  DeletedAt: string | null;
  username: string;
  email: string;
  education: string;
  ProfilePic: string;
  profession: string;
  address: any;
  designation: string;
  role: string;
  active: boolean;
  phone_number: string;
  name: string;
  about: string;
  is_verified: boolean;
  company: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export type IChatConversation = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Participants: IChatParticipant[];
  Type: string;
  UnreadCount: number;
  Messages: IChatMessage[];
};

export type IChatSendMessage = {
  conversationId: string;
  messageId: string;
  message: string;
  contentType: 'text';
  attachments: string[];
  createdAt: Date | string | number;
  senderId: string;
};

// ----------------------------------------------------------------------

export type IChatContactsState = {
  byId: Record<string, IChatParticipant>;
  allIds: string[];
};

export type IChatConversationsState = {
  byId: Record<string, IChatConversation>;
  allIds: string[];
};

export type IChatState = {
  isLoading: boolean;
  error: Error | string | null;
  contacts: IChatContactsState;
  conversations: IChatConversationsState;
  activeConversationId: null | string;
  participants: IChatParticipant[];
  recipients: IChatParticipant[];
};
