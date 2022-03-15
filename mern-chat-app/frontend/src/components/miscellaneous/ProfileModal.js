import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {darktheme} = ChatState();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} bg = {darktheme ?  "rgb(45,55,72)" : "white" }    
        
        _hover ={darktheme ? {background:"rgb(45,55,72)"} : {background:"white"}}
        
        icon={<ViewIcon color={darktheme ? "white" : "black"} />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
            bg={darktheme ? "rgb(26,32,44)" : "white"}
            color ={darktheme ? "white" : "black"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton  color ={darktheme ? "white" : "black"} />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            bg={darktheme ? "rgb(26,32,44)" : "white"}
            color ={darktheme ? "white" : "black"}
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
              color ={darktheme ? "white" : "black"}
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter     color ={darktheme ? "white" : "black"}  bg={darktheme ? "rgb(26,32,44)" : "white"}>
            <Button onClick={onClose}  
            color ={darktheme ? "white" : "black" }
            _hover ={darktheme ? {background:"rgb(45,55,72)"} : {background:"white"}}
            
            bg={darktheme ? "rgb(76,88,105)" : "white"} >Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
