import "./App.css";
import "./index.css"
import AllRoutes from "./Routes";
import {registerLicense} from '@syncfusion/ej2-base'

//TODO Responsiveness
//TODO Loading Screen
//TODO Modal Confirmation


function App() {
  registerLicense('Ngo9BigBOggjHTQxAR8/V1NAaF1cXmhKYVF2WmFZfVpgdV9CY1ZQRWYuP1ZhSXxXdkdiUH9fdHdURGJYWUE=')
  return (
    <>
      <AllRoutes />
    </>
  );
}

export default App;
