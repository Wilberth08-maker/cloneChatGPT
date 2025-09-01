import './index.css';
import RoutesIndex from "@/routes/RoutesIndex"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {

  return (
    <>

      <ToastContainer />
      <RoutesIndex />
    </>
  );
}

export default App;
