import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Box } from "@chakra-ui/layout";

import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Avatar } from "@chakra-ui/avatar";


const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [picavatar,setPicAvatar] = useState();


  const myform = new FormData();

  myform.append("name", name);
  myform.append("email", email);
  myform.append("password", password);
  myform.append("pics", pic);

  const submitHandler = async () => {
    setPicLoading(true);


    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {

      // myform.set("pics", pic);

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      const { data } = await axios.post(
        "/api/user",
        myform, config
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };
  const registerDataChange = (e) => {
    if (e.target.files.length === 1) {
      
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPic(reader.result);
          setPicAvatar(reader.result);
          
        }
      };
      console.log(picavatar);
      reader.readAsDataURL(e.target.files[0])
    };




  }




  return (
    <VStack spacing="5px">Your
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="Email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>

        {/* <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={registerDataChange}
        
          /> */}
         <Box   d="flex">
           
           <Avatar
             size="md"
             cursor="pointer"
             name="habhai"
             src={picavatar}
             border="1px solid black"
             />
        <label style={{
          padding: "10px",
          background: "red",
          display: "table",
          color: "#fff",
          cursor:"pointer"
        }}> Upload Your Image <CloudUploadIcon />
          <input type="file" size="60" style={{ display: "none" }} 
         
         accept="image/*"
         onChange={registerDataChange}
         
         
         />
        </label>
          </Box>

      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
