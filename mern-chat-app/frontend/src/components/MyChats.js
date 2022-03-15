import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { Tooltip } from "@chakra-ui/tooltip";
import { Avatar } from "@chakra-ui/avatar";
import GroupIcon from '@mui/icons-material/Group';




const MyChats = ({ fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState(); 



  const { selectedChat, setSelectedChat, user, chats, setChats,darktheme } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
   
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
     
    
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  
  }, [fetchAgain]);

  return (
    <>
 
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      bg={darktheme ? "rgb(26,32,44)" : "white"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        
        color ={darktheme ? "white" :"black"}
      >
        My Chats

        <GroupChatModal>
        <Tooltip label ="Create a New Group Chat" hasArrow placeContent="bottom-end">
          <Button
            d="flex"
            bg={darktheme ? "#2D3748" : "white"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            color ={darktheme ? "white" :"black"}
            _hover ={darktheme ? {background:"rgb(45,55,72)"} : {background:"white"}}
            >
            New Group Chat
          </Button>
      </Tooltip>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        bg={darktheme ? "#011627" : "#E7DCC6"}
      >
        {chats ? (
          <Stack overflowY="scroll" >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#5a1eec" : "#c8c591"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                d="flex"
                borderRadius="lg"
                key={chat._id}
                >  
                   <Avatar
                  size="md"
                  cursor="pointer"
                  name="habhai"
                  src={ chat.isGroupChat ? "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" : chat.users[1].pic}
                  border = "1px solid black"
                  />
               <Box
                px={2}
                // py={1}
                >

               

                <Text  px={2}  py={-4}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                      <Box  display="inline" px={2}>
                   {chat.isGroupChat  ? (
                      <Tooltip label="Group Chat" placement="bottom-start" hasArrow>

                    <GroupIcon style = {{color : "red"}} />
                      </Tooltip>
                     

                   ) : <>
                   
                   
                   </>}

                    

               </Box>
              
                  
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs"  px={2}  >
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                  
                )}
             
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
        </>
  );
};

export default MyChats;
