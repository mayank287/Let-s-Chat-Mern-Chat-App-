import { FormControl } from "@chakra-ui/form-control";
import { Input,InputRightAddon,InputGroup } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Img, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import Notification from "../Sounds/Sound.mp3";
import useSound from 'use-sound';
import { Send } from "@mui/icons-material"
import Chat from "../animations/Chat.gif"
import dark from "../animations/dark.gif"
import topbar from "topbar";
import DarkTopLoaderBar from "../Topbar/Darktopbar";
import TopLoaderBar from "../Topbar/Topbar";
import { Avatar } from "@chakra-ui/avatar";




import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import checkPageStatus from "./userAvatar/pagestatuscheck";
const ENDPOINT = "https://lets-chat-mern-app.herokuapp.com"; 
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  
  const [Play, { stop }] = useSound(Notification);
  
  
  // -------------------------------- controlling Use State --------------------------------//


  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [desktopnotify,setdesktopnotify] = useState({});
  const toast = useToast();

  //  --------------------------------------------------- Default Option ---------------------------//
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification, darktheme } =
  ChatState();
  {darktheme ?  DarkTopLoaderBar() : TopLoaderBar()};


  const fetchMessages = async () => {
    if (!selectedChat) return;
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
    
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() =>{


    checkPageStatus(desktopnotify);
  },[desktopnotify])

  //  -------------------------------------------- Socket.io deployment  ----------------------------//
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

  }, []);

  const sendMessage = async (event) => {

    if (event.key === "Enter" && newMessage  || event.type === "click") {
      socket.emit("stop typing", selectedChat._id);


      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };


  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
 
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setdesktopnotify(newMessageRecieved);
          
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
          { Play() };









        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
 

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
           
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
               bg = {darktheme ?  "rgb(45,55,72)" : "white"}
              d={{ base: "flex", md: "none" }}
              _hover ={darktheme ? {background:"rgb(45,55,72)"} : {background:"white"}}
              icon={<ArrowBackIcon color={darktheme ? "white" : "black"}  />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
         
                   <Avatar
                  size="md"
                  cursor="pointer"
                  name="habhai"
                  src={selectedChat.users[1].pic }
    
                  />
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                   <Avatar
                  size="md"
                  cursor="pointer"
                  name="habhai"
                  src={"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" }
                
                  />
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg = {darktheme ? "#011627" : "#e7dcc6"}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <>
              <Spinner
              size="xl"
              w={20}
              h={20}
              alignSelf="center"
              margin="auto"
             
              /> 
              {topbar.show()}
              </>
            
            
            ) : (
              <div className="messages"  >
                <ScrollableChat messages={messages} />
              {topbar.hide()}

              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <InputGroup>
              <Input
                focusBorderColor="blue.500"
                bg= { darktheme ? "#2D3748":"#f0f0f0e6"}
                _placeholder={{ color: 'blue.500' }}
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                />
              <InputRightAddon  bg="#b5b450" cursor="pointer"  children={<Send onClick ={sendMessage} />}  />
                </InputGroup>


             

            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box  alignItems="center" justifyContent="center" h="100%">
          <img src={ darktheme ? dark : Chat } />
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
