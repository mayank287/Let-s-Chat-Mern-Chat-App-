import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import { useState } from "react";
import b from "../src/Video/b.mp4"



function App() {
 
  return (
    
    <div className="App">
   
      <video autoPlay loop muted
      style ={{
        position:"absolute",
        width:"100%",
        left:"50%",
        top:"50%",
        height:"100%",
        objectFit:"cover",
        transform:"translate(-50%,-50%)",
        zIndex:"-1"

      }}
      >
        <source src={b} type="video/mp4"/>
      </video>
    

      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
      
    
    </div>
  );
}

export default App;
