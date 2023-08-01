import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pool, relays } from "@/config";
import { Lightbulb, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Event, relayInit } from "nostr-tools";
import { useEffect, useState } from "react";

export default function JobResultsList({ jobEventId }: { jobEventId: string }) {
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);

  async function getJobResults() {
    const relay = relayInit("wss://relay.damus.io");

    await relay.connect();

    const pubs = relay.sub([
      {
        kinds: [65001],
        "#e": [jobEventId],
      },
    ]);

    pubs.on("event", (event) => {
      console.log(event);
      // Check if event.id is not already in the results array
      if (
        !results.some(
          (result) => result.id === event.id && result.content === event.content
        )
      ) {
        // Update the results array by adding the new event
        setResults((prevResults) => [...prevResults, event]);
      }
    });

    // pubs.on("eose", () => {
    //   pool.close(relays);
    // });
  }

  function removeDuplicates(results: any) {
    const uniqueResults: any = [];
    const labels: string[] = [];

    for (const result of results) {
      const labeTag = result.tags.find((tag) => tag[0] === "t");

      if (!labels.includes(labeTag[1])) {
        labels.push(labeTag[1]);
        uniqueResults.push(result);
      }
    }

    return uniqueResults;
  }

  useEffect(() => {
    getJobResults();
  }, [jobEventId]);

  return (
    <Card>
      <CardHeader className="p-2">
        <CardTitle>Job Results</CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Monitoring Job Results
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {removeDuplicates(results).map((result: Event) => {
              const amountTag = result.tags.find((tag) => tag[0] === "amount");
              const amount = amountTag ? parseInt(amountTag[1]) / 1000 : 0;

              const descriptionTag = result.tags.find((tag) => tag[0] === "t");
              const description = descriptionTag ? descriptionTag[1] : "";

              const invoice = amountTag ? amountTag[2] : null;

              return (
                <Button
                  key={result.id}
                  className="relative h-[90px] w-[185px]"
                  variant={"outline"}
                  onClick={async () => {
                    if (invoice) {
                      try {
                        await (window as any).webln.enable();
                        const { preimage } = await (
                          window as any
                        ).webln.sendPayment(invoice);

                        if (preimage) {
                          router.push(`/home/feed/${result.id}`);
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }
                  }}
                >
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <small className="text-sm font-medium leading-none">
                      {amount} sats
                    </small>

                    <Zap className="text-yellow-300" />
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <p className="text-lg text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
