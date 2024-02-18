// @ts-nocheck comment
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof } from "@semaphore-protocol/proof";
import { Group } from "@semaphore-protocol/group";
import { ethers } from "ethers";

const index = () => {
  const router = useRouter();
  const [_identity, setIdentity] = useState<Identity>();
  const [groupChatId, setGroupChatId] = useState(
    "85119186912718462354884141238312"
  );
  const [grpMemberId, setGrpMemberId] = useState(
    "16081179360181561876336335380482356100492060555330666443062979952430873826045"
  );
  const [sampleMsg, setSampleMsg] = useState("Hello World!");
  const [grpMembers, setGrpMembers] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const localStorageCommitment = "bandada-identity-commitment";
  const localStoragePrivateKey = "bandada-identity-privatekey";
  const localStorageSecret = "bandada-identity-Secret";
  const localStorageString = "bandada-identity-String";

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
    const res = await fetch(
      `https://api.bandada.pse.dev/groups/${groupChatId}/members/${grpMemberId}/proof`
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
    const res = await fetch(
      `https://api.bandada.pse.dev/groups/${groupChatId}/members/${grpMemberId}`
    );
    const data = await res.json();
    console.log(data);
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
    console.log(data);
  };

  const sendChat = async () => {
    const res = await fetch(`/api/send-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId: router.query.chatId,
        messageBody: inputMessage,
        userId: localStorage.getItem(localStorageCommitment),
      }),
    });
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    if (router) {
      getInfo();
      generateMerkleProof();
      checkMember();
      getChats();
    }
  }, [router]);

  return (
    <div>
      {router.query.chatId}
      <button onClick={generateMessageProof}>Click Me</button>
      <input
        type="text"
        onChange={(e) => setInputMessage(e.target.value)}
        value={inputMessage}
      />
      <button onClick={sendChat}>Send Message</button>
    </div>
  );
};

export default index;
