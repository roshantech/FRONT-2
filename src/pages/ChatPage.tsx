import { Helmet } from 'react-helmet-async';
// sections
import { Chat } from './chat';

// ----------------------------------------------------------------------

export default function ChatPage() {
  return (
    <>
      <Helmet>
        <title> Chat | Minimal UI</title>
      </Helmet>

      <Chat />
    </>
  );
}
