import './index.css';
import RoutesIndex from "@/routes/RoutesIndex";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChatProvider } from './context/ChatContext';


function App() {

  return (
    <>
      <ChatProvider>
        <ToastContainer />
        <RoutesIndex />
      </ChatProvider>
    </>
  );
}

export default App;
