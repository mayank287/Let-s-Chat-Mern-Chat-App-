import favicon from "../../../public/favicon.ico"



export default function checkPageStatus(props) {
    if(!("Notification" in window)) {
      alert("This browser does not support system notifications!")
    } 
    else if(Notification.permission === "granted") {
      sendNotification(props)
    }
    else if(Notification.permission !== "denied") {
       Notification.requestPermission((permission)=> {
          if (permission === "granted") {
            sendNotification(props)
          }
       })
    }
};
function sendNotification(props) {
    const notification = new Notification(`New Message From ${props.sender?.name == undefined ? "Welcome To Let's Chat App" : props.sender?.name}`, {
       icon: `${props.sender?.pic == undefined ? favicon : props.sender?.pic}`,
      body: `${props.content == undefined ? "Hope U Like This App Made By Mayank": props.content}`
    })
    notification.onclick = ()=> function() {
      window.open("https://lets-chat-mern-app.herokuapp.com/chats")
    }
}