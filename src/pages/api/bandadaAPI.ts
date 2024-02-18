// @ts-nocheck comment
import { request } from "@bandada/utils";
import { SiweMessage } from "siwe";
import { Group } from "../types";

const API_URL = "https://api.bandada.pse.dev";

export async function getGroups(adminId: string): Promise<Group[] | null> {
  try {
    const groups = await request(`${API_URL}/groups/?adminId=${adminId}`);

    return groups.map((group: Group) => ({
      ...group,
      type: "off-chain",
    }));
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It returns details of a specific group.
 * @param groupId The group id.
 * @returns The group details.
 */
export async function getGroup(groupId: string): Promise<Group | null> {
  try {
    const group = await request(`${API_URL}/groups/${groupId}`);

    return { ...group, type: "off-chain" };
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It creates a new group.
 * @param name The group name.
 * @param description The group description.
 * @param treeDepth The Merkle tree depth.
 * @returns The group details.
 */
export async function createGroup(
  name: string,
  description: string,
  treeDepth: number,
  fingerprintDuration: number,
  credentials?: any
): Promise<Group | null> {
  try {
    const group = await request(`${API_URL}/groups`, {
      method: "POST",
      data: {
        name,
        description,
        treeDepth,
        fingerprintDuration,
        credentials: JSON.stringify(credentials),
      },
    });

    return { ...group, type: "off-chain" };
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It updates the detail of a group.
 * @param group The group id.
 * @param memberId The group member id.
 */
export async function updateGroup(
  groupId: string,
  { apiEnabled }: { apiEnabled: boolean }
): Promise<Group | null> {
  try {
    const group = await request(`${API_URL}/groups/${groupId}`, {
      method: "PATCH",
      data: { apiEnabled },
    });

    return { ...group, type: "off-chain" };
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It generates a new API key.
 * @param group The group id.
 */
export async function generateApiKey(groupId: string): Promise<string | null> {
  try {
    return await request(`${API_URL}/groups/${groupId}/api-key`, {
      method: "PATCH",
    });
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It removes a group.
 * @param groupId The group id.
 */
export async function removeGroup(groupId: string): Promise<void | null> {
  try {
    await request(`${API_URL}/groups/${groupId}`, {
      method: "DELETE",
    });
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It returns a random string to be used as a OAuth state, to to protect against
 * forgery attacks. It will be used to retrieve group, member, redirectURI and provider
 * before checking credentials and adding members.
 * @param group The group id.
 * @param memberId The group member id.
 * @param redirectUri The URL where clients will be sent after authorization.
 * @param providerName OAuth provider name.
 * @returns The OAuth state id.
 */
export async function setOAuthState(
  groupId: string,
  memberId: string,
  providerName: string,
  redirectUri?: string
): Promise<string | null> {
  try {
    return await request(`${API_URL}/credentials/oauth-state`, {
      method: "POST",
      data: {
        groupId,
        memberId,
        providerName,
        redirectUri,
      },
    });
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It adds a new member to an existing credentials group.
 * @param oAuthState The OAuth state.
 * @param oAuthCode The OAuth code.
 */
export async function addMemberByCredentials(
  oAuthState: string,
  oAuthCode: string
): Promise<string | null> {
  try {
    return await request(`${API_URL}/credentials`, {
      method: "POST",
      data: {
        oAuthCode,
        oAuthState,
      },
    });
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It adds a new member to an existing group.
 * @param group The group id.
 * @param memberId The group member id.
 */

/**
 * It adds new members to an existing group.
 * @param group The group id.
 * @param memberIds The array of group member ids.
 */
export async function addMember(
  groupId: string,
  memberId: string
): Promise<void | null> {
  try {
    await request(`${API_URL}/groups/${groupId}/members/${memberId}`, {
      method: "POST",
      headers: {
        "x-api-key": "52d4df3f-04fa-44d0-a7e6-5af3c73869db",
      },
    });
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It removes a member from a group.
 * @param group The group id.
 * @param memberId The group member id.
 */
export async function removeMember(
  groupId: string,
  memberId: string
): Promise<void | null> {
  try {
    await request(`${API_URL}/groups/${groupId}/members/${memberId}`, {
      method: "DELETE",
    });
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It removes members from a group.
 * @param group The group id.
 * @param memberIds The array of group member ids.
 */
export async function removeMembers(
  groupId: string,
  memberIds: string[]
): Promise<void | null> {
  try {
    await request(`${API_URL}/groups/${groupId}/members`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        memberIds,
      }),
    });
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It returns a SIWE nonce for authentication, used to prevent replay attacks.
 * @returns The SIWE nonce.
 */
export async function getNonce(): Promise<string | null> {
  try {
    return await request(`${API_URL}/auth/nonce`, {
      method: "GET",
    });
  } catch (error: any) {
    console.error(error);

    console.log(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It allows admins to authenticate.
 * @param message The SIWE message.
 * @param signature The SIWE signature of the message.
 * @returns The admin details.
 */
export async function signIn({
  message,
  signature,
}: {
  message: SiweMessage;
  signature: string;
}): Promise<any | null> {
  try {
    return await request(`${API_URL}/auth`, {
      method: "POST",
      data: {
        message: "You are using your Ethereum Wallet to sign in to Bandada",
        signature: signature,
      },
    });
  } catch (error: any) {
    console.error(error);
    console.log(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It allows admins to log out.
 */
export async function logOut(): Promise<void | null> {
  try {
    await request(`${API_URL}/auth`, {
      method: "DELETE",
    });
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}

/**
 * It returns true if the admin is logged in, false otherwise.
 * @returns True or false.
 */
export async function isLoggedIn(): Promise<null | boolean> {
  try {
    return await request(`${API_URL}/auth`, {
      method: "GET",
    });
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      alert(error.response.statusText);
    } else {
      alert("Some error occurred!");
    }

    return null;
  }
}
