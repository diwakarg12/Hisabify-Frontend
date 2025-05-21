import Header from "./Component/Common/Header/Header";
import SideNav from "./Component/Common/SideNavBar/SideNav";
import Loginsignup from "./Component/Pages/Login_Signup/loginsignup";


function App() {

  return (
    <div className="flex flex-col bg-gray-300" >
      <Loginsignup />
      {/* <Header />
      <SideNav /> */}
     
    </div>
  )
}

export default App;
