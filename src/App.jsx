import Header from "./Component/Common/Header/Header";
import SideNav from "./Component/Common/SideNavBar/SideNav";
import Loginsignup from "./Component/Pages/LoginSignup/Loginsignup";
import RoutesConfig from "./config/RoutesConfig";


function App() {

  return (
    <div className="flex flex-col bg-gray-300" >
      <RoutesConfig />
    </div>
  )
}

export default App;
