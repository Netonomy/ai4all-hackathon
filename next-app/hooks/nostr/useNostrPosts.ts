import { pool, relays } from "@/config";
import { privateKeyHexAtom } from "@/state/privatekeyHexAtom";
import { postsAtom } from "@/state/social/postsAtom";
import { useAtom } from "jotai";
import { getPublicKey } from "nostr-tools";
import { useEffect } from "react";

export default function useNostrPosts() {
  const [posts, setPosts] = useAtom(postsAtom);
  const [privateKey] = useAtom(privateKeyHexAtom);

  async function getPosts() {
    if (privateKey) {
      const pubKey = getPublicKey(privateKey);

      const postEvents = await pool.list(relays, [
        {
          kinds: [1],
          authors: [pubKey],
        },
      ]);

      setPosts(postEvents);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return posts;
}
