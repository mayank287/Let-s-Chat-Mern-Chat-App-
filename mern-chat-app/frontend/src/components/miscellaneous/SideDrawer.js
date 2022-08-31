import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Select} from '@chakra-ui/react'
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import MetaData from "../Metadata";



function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
    darktheme,
    setDarktheme

  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  useEffect(() => {
    localStorage.setItem("theme",darktheme)
  
    
  }, [darktheme])

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
  

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      {
        notification.length === 0 ? (<MetaData title={`Let's Chat`} />) : (
          <MetaData title={`(${notification.length}) Let's Chat`} />
        )

      }

      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={darktheme ? "#1a202c" : "white"}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={darktheme ? "0px" : "0px"}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} bg={darktheme ? "rgb(45,55,72)" : "white"} color={darktheme ? "white" : "black"} _hover={darktheme ? { background: "rgb(45,55,72)" } : { background: "white" }}  >
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Tooltip label="Let's Chat" hasArrow placement="bottom-end">

          <Text fontSize="2xl" fontFamily="Work sans" color={darktheme ? "white" : "black"}>
            Let's Chat
          </Text>
        </Tooltip>
        <div>
          <Menu>
       
          <Select onChange={(e) =>     setDarktheme(e.target.value == "true" ? true : false)} bg={darktheme ? "#2D3748" : "white"} color = {darktheme ? "white" : "black"}>
              <option value='false' style={{ background: darktheme ? "#2D3748" : "white" }}>Light</option>
              <option value='true' selected = {darktheme ? "selected" : ""} style={{ background: darktheme ? "#2D3748" : "white" }}  >Dark</option>
         
            </Select>



         
            <Tooltip label="Notifications" hasArrow placement="bottom-end">
              <MenuButton p={1}>

                <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                />

                <BellIcon fontSize="2xl" m={1} color={darktheme ? "white" : "black"} />
              </MenuButton>
            </Tooltip>
            <MenuList pl={2} bg={darktheme ? "#2C384F" : "white"}
              color={darktheme ? "white" : "black"}>

              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  bg={darktheme ? "2C384F" : "white"}
                  color={darktheme ? "white" : "black"}
                     _hover ={darktheme ? {background:"rgb(45,55,72)"} : {background:"white"}}

                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <Tooltip label="Profile/Logout" hasArrow placement="bottom-end">


              <MenuButton as={Button} _hover
                ={darktheme ? { background: "rgb(45,55,72)" } : { background: "white" }}
                bg={darktheme ? "rgb(45,55,72)" : "white"}
                rightIcon={<ChevronDownIcon color={darktheme ? "white" : "black"} />} >
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.name}
                  src={user.pic}
                />
              </MenuButton>
            </Tooltip>
            <MenuList
              bg={darktheme ? "#2C384F" : "white"}
              color={darktheme ? "white" : "black"}
              _hover={darktheme ? { background: "rgb(45,55,72)" } : { background: "white" }}
            >
              <ProfileModal user={user}>
                <MenuItem _hover={darktheme ? { background: "#5A5C65" } : { background: "white" }}>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem _hover={darktheme ? { background: "#5A5C65" } : { background: "white" }} onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen} >
        <DrawerOverlay />
        <DrawerContent bg={darktheme ? "#011627" : "white"}>
          <DrawerHeader borderBottomWidth="1px" bg={darktheme ? "#1A202C" : "white"} color={darktheme ? "white" : "black"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                bg={darktheme ? "#232e41" : "#E7DCC6"}
                _placeholder={{ color: 'red.500' }}
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
               
                color={darktheme ? "white" : "black"}
              />
              <Button onClick={handleSearch} bg={darktheme ? "rgb(45,55,72)" : "white"}
                color={darktheme ? "white" : "black"}
                _placeholder={{ color: 'red.500' }}
                _hover={darktheme ? { background: "rgb(45,55,72)" } : { background: "white" }} >Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (

                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />

              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" color={darktheme ? "white" : "black"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
