import {
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  getSignature,
  validateEvent,
  verifySignature,
} from "nostr-tools";
import "websocket-polyfill";
import { SimplePool } from "nostr-tools";
import app from "./app/createExpressApp.js";
import moment from "moment";
import { createInvoice } from "lightning";
import { lnd } from "./app/config/lndClient.js";

const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send({ hello: "world" }));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export const pool = new SimplePool();

export let relays = [
  "wss://eden.nostr.land",
  "wss://nos.lol",
  "wss://nostr.mom",
  "wss://relay.current.fyi",
  "wss://relay.damus.io",
  "wss://relay.snort.social",
];

let sk = generatePrivateKey();
let pk = getPublicKey(sk);

let eventsCache: Event[] = [];

// Cache updating function
async function updateCache(): Promise<void> {
  const events = await getTrendingEvents();
  eventsCache = events;

  // Set a timer to update the cache in 24 hours
  setTimeout(updateCache, 24 * 60 * 60 * 1000);
}

updateCache();

export async function getTrendingEvents(): Promise<Event[]> {
  return new Promise((resolve, reject) => {
    // Since timestamp. Two days ago
    const twoDaysAgo = moment().subtract(4, "days").unix();

    // Until timstamp. Right now
    const now = moment().unix();

    const sub = pool.sub(relays, [
      {
        kinds: [1],
        since: twoDaysAgo,
        authors: [
          // Popular accounts found from: https://nostr.directory/
          "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2",
          "339d7804b6a69b7ef05a169d72ca3e977f64eb00ab6eedf21af0a2c2327691b3",
          "a3b0ce5d70d0db22885706b2b1f144c6864a7e4828acff3f8f01ca6b3f54ad15",
          "ed3961c0c25410112fff45e01aaecce49e2a5f533a683c50734a53caa8d63681",
          "eab0e756d32b80bcd464f3d844b8040303075a13eabc3599a762c9ac7ab91f4f",
          "85080d3bad70ccdcd7f74c29a44f55bb85cbcd3dd0cbb957da1d215bdb931204",
          "c4eabae1be3cf657bc1855ee05e69de9f059cb7a059227168b80b89761cbc4e0",
          "090254801a7e8e5085b02e711622f0dfa1a85503493af246aa42af08f5e4d2df",
          "8fe3f243e91121818107875d51bca4f3fcf543437aa9715150ec8036358939c5",
          "04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9",
          "04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9",
          "8fce46c6d2dc4236b24a23382a02d3400548fdf6d286da701914280f4d6dbe73",
          "5c4fc29a42809b0ac8e018ec7fcbc18cce85086457fe873b9cd925e18790996e",
          "6b0d4c8d9dc59e110d380b0429a02891f1341a0fa2ba1b1cf83a3db4d47e3964",
          "7fa92094e2293f097c7cfef2933ed37a167062c254c540aa7ec26e8019cec726",
          "1989034e56b8f606c724f45a12ce84a11841621aaf7182a1f6564380b9c4276b",
          "883fea4c071fda4406d2b66be21cb1edaf45a3e058050d6201ecf1d3596bbc39",
          "8e02f19eb35e8c0ee48536fc9ad5dd26785b487b4b8e4ca3ed010ea974ccc564",
          "c49d52a573366792b9a6e4851587c28042fb24fa5625c6d67b8c95c8751aca15",
        ],

        until: now,
      },
    ]);

    let events: any[] = [];

    sub.on("event", (event: any) => {
      events.push(event);
    });

    sub.on("eose", async () => {
      events = events.slice(0, 25); // Testing purposes
      for (const event of events) {
        const reactions = await pool.list(
          relays,
          [{ "#e": [event.id], kinds: [7] }],
          {
            alreadyHaveEvent: () => false,
          }
        );

        event.reactionCount = reactions.length;
        console.log(event.reactionCount);
      }

      // Now that we have the reaction counts, we can sort the events
      events.sort((a, b) => {
        return b.reactionCount - a.reactionCount;
      });

      let top100events = events.slice(0, 50);

      resolve(top100events);
    });
  });
}

const sub = pool.sub(relays, [
  {
    kinds: [65006],
    since: moment().subtract(2, "minutes").unix(),
  },
]);

sub.on("event", async (event) => {
  console.log(event);

  const invoice = await createInvoice({ lnd, mtokens: "100000" });

  let jobResultEvent: any = {
    kind: 65001,
    content: JSON.stringify(eventsCache),
    tags: [
      ["e", event.id],
      ["p", event.pubkey],
      ["s", "success"],
      ["request", JSON.stringify(event)],
      ["amount", "100000", invoice.request],
    ],
    pubkey: pk,
    created_at: Math.floor(Date.now() / 1000),
  };

  jobResultEvent.id = getEventHash(jobResultEvent);
  jobResultEvent.sig = getSignature(jobResultEvent, sk);

  console.log(jobResultEvent);

  let ok = validateEvent(jobResultEvent);
  let veryOk = verifySignature(jobResultEvent);

  console.log(ok);
  console.log(veryOk);

  let pubs = pool.publish(relays, jobResultEvent);

  pubs.on("ok", () => {
    console.log("published okay");
  });
  pubs.on("failed", () => {
    console.log("Failed to publish job result");
  });
});
