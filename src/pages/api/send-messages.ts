// @ts-nocheck comment
import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../utils/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { groupId, userId, messageBody } = req.body;

  const { data, error } = await supabase
    .from("messages")
    .insert([{ group_id: groupId, user_id: userId, message_body: messageBody }])
    .select()
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    res.status(500).end();
    return;
  }

  res.status(200).send(data);
}
