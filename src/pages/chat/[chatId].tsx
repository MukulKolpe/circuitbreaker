// @ts-nocheck comment
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Icon,
  Heading,
  Text,
  Input,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof } from "@semaphore-protocol/proof";
import { Group } from "@semaphore-protocol/group";
import { ethers } from "ethers";
import { Center } from "@chakra-ui/react";

const index = () => {
  const router = useRouter();
  const groupChatId = router.query.chatId;
  const [_identity, setIdentity] = useState<Identity>();
  const [grpMemberId, setGrpMemberId] = useState(
    "16081179360181561876336335380482356100492060555330666443062979952430873826045"
  );
  const [sampleMsg, setSampleMsg] = useState("Hello World!");
  const [grpMembers, setGrpMembers] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMember, setIsMember] = useState("loading");
  const [chatData, setChatData] = useState([]);
  const localStorageCommitment = "bandada-identity-commitment";
  const localStoragePrivateKey = "bandada-identity-privatekey";
  const localStorageSecret = "bandada-identity-Secret";
  const localStorageString = "bandada-identity-String";
  const localCustomCommitment = "semaphore-id";

  const getInfo = async () => {
    const chatId = router.query.chatId;
    const res = await fetch(
      `https://api.bandada.pse.dev/groups/${groupChatId}`
    );
    if (res.status == 200) {
      const data = await res.json();
      console.log(data);
      setGrpMemberId(data.members);
    }
  };

  const generateMerkleProof = async () => {
    //const chatId = router.query.chatId;
    const tempIdentityString = localStorage.getItem("commitment-id");

    const res = await fetch(
      `https://api.bandada.pse.dev/groups/${groupChatId}/members/${tempIdentityString}/proof`
    );
    if (res.status == 200) {
      const data = await res.json();
      console.log(data);
    }
  };

  const generateMessageProof = async () => {
    const identity = new Identity(localStorageString);
    console.log(identity);
    //const users = await getMembersGroup(groupChatId);
    const group = new Group(groupChatId, 16, grpMembers);
    console.log(group);
    const signal = BigInt(
      ethers.utils.formatBytes32String(sampleMsg)
    ).toString();
    console.log(signal);
    // const { proof, merkleTreeRoot, nullifierHash } = await generateProof(
    //   identity,
    //   group,
    //   groupChatId,
    //   signal
    // );
    // console.log(sampleObj);
  };

  const createIdentity = async () => {
    const identity = new Identity();
    console.log(identity);
    console.log(identity.toString());
    setIdentity(identity);

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(localStorageCommitment, identity._commitment);
      localStorage.setItem(localStoragePrivateKey, identity._privateKey);
      localStorage.setItem(localStorageSecret, identity._secretScalar);
      localStorage.setItem(localStorageString, identity.toString());
    }

    console.log("Your new Semaphore identity was just created 🎉");
  };

  const checkMember = async () => {
    const tempIdentityString = localStorage.getItem("commitment-id");

    const res = await fetch(
      `https://api.bandada.pse.dev/groups/${groupChatId}/members/${tempIdentityString}`
    );
    const data = await res.json();
    console.log(groupChatId);
    console.log(tempIdentityString);
    console.log(data);
    if (data) {
      setIsMember("Granted");
    } else {
      setIsMember("Denied");
    }
  };

  useEffect(() => {
    const identityString = localStorage.getItem(localStorageCommitment);

    if (identityString) {
      const identity = new Identity(identityString);

      setIdentity(identity);

      console.log(
        "Your Semaphore identity was retrieved from the browser cache 👌🏽"
      );
    } else {
      createIdentity();
    }
  }, [localStorageCommitment]);

  const getCustomCommitment = async () => {
    const tempIdentityString = localStorage.getItem(localCustomCommitment);
    const identity = new Identity(tempIdentityString);
    setIdentity(identity);
    console.log(identity);
    console.log(identity._commitment.toString());
  };

  const getChats = async () => {
    const res = await fetch(`/api/get-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId: router.query.chatId,
      }),
    });
    const data = await res.json();
    setChatData(data);
    console.log(data);
  };

  const sendChat = async () => {
    const tempIdentityString = localStorage.getItem("commitment-id");
    generateMerkleProof();
    const res = await fetch(`/api/send-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId: router.query.chatId,
        messageBody: inputMessage,
        userId: tempIdentityString,
      }),
    });
    const data = await res.json();
    console.log(data);
    getChats();
  };

  useEffect(() => {
    if (router) {
      getInfo();
      generateMerkleProof();
      checkMember();
      getChats();
    }
  }, [router]);

  if (isMember == "loading") {
    return <Center>Loading...</Center>;
  }

  return (
    <div>
      {isMember == "Denied" ? (
        <Center>You are not a member of the Group</Center>
      ) : (
        <div position="relative" h="100vh">
          <Flex
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            scrollBehavior={"smooth"}
            overflowY={"scroll"}
            height={"70vh"}
            mt={"50px"}
          >
            {chatData.map((chat, index) => (
              <Box
                key={index}
                backgroundColor={"teal"}
                padding={"20px"}
                mt={10}
                width={"50vw"}
                borderRadius={10}
              >
                <Flex flexDir={"row"} justifyContent={"space-around"}>
                  <Text ml={-40}>
                    {"From:"} {chat.user_id.slice(0, 6)}
                    {"..."}
                    {chat.user_id.slice(-8)}
                  </Text>

                  <Text>
                    <b>{chat.message_body}</b>
                  </Text>
                </Flex>
              </Box>
            ))}
          </Flex>
          <Flex
            position="absolute"
            flexDir={"row"}
            width={"100vw"}
            bottom="0"
            padding={10}
          >
            <Input
              type="text"
              onChange={(e) => setInputMessage(e.target.value)}
              value={inputMessage}
            />
            <Button onClick={sendChat}>Send Message</Button>
          </Flex>
        </div>
      )}
    </div>
  );
};

export default index;
