import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="45px" borderRadius= "50px" />
      <Skeleton height="45px" borderRadius= "50px"/>
      <Skeleton height="45px" borderRadius= "50px"/>
      <Skeleton height="45px" borderRadius= "50px"/>
      <Skeleton height="45px" borderRadius= "50px"/>
      <Skeleton height="45px" borderRadius= "50px"/>
      <Skeleton height="45px" borderRadius= "50px"/>
      <Skeleton height="45px" borderRadius= "50px"/>
      <Skeleton height="45px" borderRadius= "50px"/>
      <Skeleton height="45px" borderRadius= "50px" />
      <Skeleton height="45px" borderRadius= "50px"/>
      <Skeleton height="45px" borderRadius= "50px"/>
    </Stack>
  );
};

export default ChatLoading;
