import { useEffect, useState, useRef } from 'react';
import { useWebsocket } from 'src/useWebsocket';
// @types
import { IChatConversation, IChatMessage } from '../../../@types/chat';
//
import Scrollbar from '../../../components/scrollbar';
import Lightbox from '../../../components/lightbox';
//
import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

type Props = {
  conversation: IChatConversation;
  setCurrentConversation:(consersation: IChatConversation) => void,
};

export default function ChatMessageList({ conversation,setCurrentConversation }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [selectedImage, setSelectedImage] = useState<number>(-1);
  const { socket } = useWebsocket()


  useEffect(() => {
    socket?.addEventListener("message", (event) => {
      console.log("Received message:", JSON.parse(event.data));
      const dat = JSON.parse(event.data) ;
      if(dat.Type === "ChatMessage"){
        const newConv = {...conversation}
        newConv.Messages = [...newConv.Messages , dat.Message as IChatMessage]
        setCurrentConversation(newConv)
      }
    });

    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [conversation, setCurrentConversation, socket]);

  const imagesLightbox = conversation.Messages
    .filter((messages) => messages.ContentType === 'image')
    .map((messages) => ({ src: messages.Body }));

  const handleOpenLightbox = (imageUrl: string) => {
    const imageIndex = imagesLightbox.findIndex((image) => image.src === imageUrl);
    setSelectedImage(imageIndex);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };
  

  return (
    <>
      <Scrollbar
        scrollableNodeProps={{
          ref: scrollRef,
        }}
        sx={{ p: 3, height: 1 }}
      >
        {conversation.Messages?.map((message) => (
          <ChatMessageItem
            key={message.ID}
            message={message}
            conversation={conversation}
            onOpenLightbox={() => handleOpenLightbox(message.Body)}
          />
        ))}
      </Scrollbar>

      <Lightbox
        index={selectedImage}
        slides={imagesLightbox}
        open={selectedImage >= 0}
        close={handleCloseLightbox}
      />
    </>
  );
}
