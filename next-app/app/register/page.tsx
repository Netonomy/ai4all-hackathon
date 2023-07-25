"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAtom } from "jotai";
import { userDetailsAtom } from "@/state/user/userDetails";
import ProfileImgSelector from "@/components/ProfileImgSelector";
import useWeb5 from "@/hooks/useWeb5";
import { Textarea } from "@/components/ui/textarea";
import {
  validateEvent,
  verifySignature,
  getSignature,
  getEventHash,
  getPublicKey,
  SimplePool,
  Event,
} from "nostr-tools";

import {
  anchor,
  DID,
  generateKeyPair,
} from "@decentralized-identity/ion-tools";
import fileDownload from "js-file-download";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import useLogin from "@/react-query/useLoginMutation";
import { loadingAtom } from "@/state/loadingAtom";
import { tokenAtom } from "@/state/tokenAtom";
import axiosInstance from "@/config/axiosInstance";
import { privateKeyHexAtom } from "@/state/privatekeyHexAtom";
import { pool, relays } from "@/config";

const schema = yup
  .object({
    name: yup.string().required(),
    macaroon: yup.string().required(),
    about: yup.string().optional(),
  })
  .required();

type FormData = {
  name: string;
  macaroon: string;
  about: string | undefined;
};

export default function Register() {
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const [profileString, setProfileString] = useState<string | null>(null);
  const [readInfo, setReadInfo] = useState(false);
  const [showReadInfoError, setShowReadInfoError] = useState(false);

  const [incorrectMacaroon, setIncorrectMacaroon] = useState(false);

  const login = useLogin();
  const [loading, setLoading] = useAtom(loadingAtom);
  const [, setToken] = useAtom(tokenAtom);
  const [, setPrivateKeyHex] = useAtom(privateKeyHexAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      login.mutate(data.macaroon, {
        onError: () => {
          setLoading(false);
          setIncorrectMacaroon(true);
        },
        onSuccess: async (res) => {
          // Store api access token
          const token = res.data.bearerToken;
          setToken(token);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;

          // store profile img in dwn
          let profileImgRecordId = "";
          if (profileImg) {
            const { record } = await web5!.dwn.records.create({
              data: profileImg,
              message: {
                dataFormat: "image/png",
              },
            });

            if (record) {
              profileImgRecordId = record.id;
            }
          }

          // Generate keys and ION DID
          let authnKeys = await generateKeyPair();
          let did = new DID({
            content: {
              publicKeys: [
                {
                  id: "key-1",
                  type: "EcdsaSecp256k1VerificationKey2019",
                  publicKeyJwk: authnKeys.publicJwk,
                  purposes: ["authentication"],
                },
              ],
              services: [],
            },
          });

          // Store the key material and source data of all operations that have been created for the DID
          let ionOps = await did.getAllOperations();
          ionOps.push({
            macaroon: data.macaroon,
          });

          setProfileString(JSON.stringify(ionOps));

          const privateKeyBase64 = ionOps[0].recovery.privateJwk.d;
          const buffer = Buffer.from(privateKeyBase64, "base64");
          const hexPrivateKey = buffer.toString("hex");

          setPrivateKeyHex(hexPrivateKey);

          const pubKey = getPublicKey(hexPrivateKey);

          let event: any = {
            kind: 0,
            pubkey: pubKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: JSON.stringify({
              name: data.name,
              about: data.about,
              picture: profileImgRecordId,
            }),
          };
          event.id = getEventHash(event);
          event.sig = getSignature(event, hexPrivateKey);

          console.log(event);

          let pubs = pool.publish(relays, event as Event);
          pubs.on("ok", (type) => {
            console.log(type);
            // this may be called multiple times, once for every relay that accepts the event
            console.log(`Relay has accepted our event`);
          });
          pubs.on("failed", (relay, reason) => {
            console.log(`failed to publish to ${relay}: ${reason}`);
          });

          setShowDownloadDialog(true);
          setLoading(false);
        },
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  });

  const [profileImg, setProfileImg] = useState<File | null>(null);

  const router = useRouter();
  const { web5, did } = useWeb5();

  return (
    <>
      <form
        className="flex flex-1 flex-col w-80 items-center"
        onSubmit={onSubmit}
      >
        <ProfileImgSelector file={profileImg} setFile={setProfileImg} />

        <div className="w-full gap-4 flex flex-1 flex-col ">
          <Input placeholder="Name" {...register("name")} />
          {errors.name && (
            <small className="text-xs font-medium leading-none text-red-600 text-center">
              {errors.name?.message}
            </small>
          )}

          <Textarea
            placeholder="About"
            className="shadow-md max-h-[200px]"
            {...register("about")}
          />

          <Input
            placeholder="LND Macaroon"
            className="shadow-md"
            {...register("macaroon")}
          />
          {errors.macaroon && (
            <small className="text-xs font-medium leading-none text-red-600 text-center">
              {errors.macaroon?.message}
            </small>
          )}

          {incorrectMacaroon && (
            <small className="text-xs font-medium leading-none text-red-600 text-center">
              Invalid Macaroon
            </small>
          )}
        </div>

        <Button className="m-6 w-80" type="submit">
          {loading ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            <>Continue</>
          )}
        </Button>
      </form>

      <AlertDialog open={showDownloadDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Account Created. Read below for continuing!
            </AlertDialogTitle>
            <div className="flex flex-col gap-2 p-2">
              <div className="flex gap-2">
                <Checkbox
                  id="readInfo"
                  checked={readInfo}
                  onClick={() => setReadInfo(!readInfo)}
                />
                <div>
                  Download your netonomy profile so you will be able to log back
                  in. Make sure not to lose this file! It contains your private
                  keys.
                </div>
              </div>

              {showReadInfoError && !readInfo && (
                <small className="text-xs font-medium leading-none text-red-600 text-center">
                  Please read before continuing
                </small>
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                if (readInfo) {
                  fileDownload(
                    JSON.stringify(profileString),
                    "netonomy-backup.json"
                  );

                  router.push("/home");
                } else {
                  setShowReadInfoError(true);
                }
              }}
            >
              Download & Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
