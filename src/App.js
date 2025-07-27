import './App.css';
import SideBar from './components/SideBar';
import Chats from './components/Chats';

function App() {
  return (
    <div className="flex h-screen">
        <SideBar />
        
        <Chats />
      
    </div>
  );
}

export default App;
