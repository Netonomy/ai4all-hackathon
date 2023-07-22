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

const schema = yup
  .object({
    name: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required(),
  })
  .required();

type FormData = {
  name: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [, setUserDetails] = useAtom(userDetailsAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit((data) => {
    setLoading(true);

    createUser(data.name)
      .then(() => router.push("/home"))
      .catch((err) => setLoading(false));
  });

  const [profileImg, setProfileImg] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { web5, did } = useWeb5();

  async function createUser(name: string) {
    try {
      if (web5 && did) {
        let profileData = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: name,
        };

        // store profile img in dwn
        if (profileImg) {
          const result = await web5.dwn.records.create({
            data: profileImg,
            message: {
              dataFormat: "image/png",
            },
          });

          profileData["image"] = result.record?.id;
        }

        // Create Person
        await web5.dwn.records.create({
          data: profileData,
          message: {
            schema: "https://schema.org/Person",
            dataFormat: "application/ld+json",
          },
        });

        setUserDetails({ did: did });
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
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

        <Input
          placeholder="Password"
          type="password"
          {...register("password")}
        />

        {errors.password && (
          <small className="text-xs font-medium leading-none text-red-600 text-center">
            {errors.password?.message}
          </small>
        )}

        <Input
          placeholder="Confirm Password"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <small className="text-xs font-medium leading-none text-red-600 text-center">
            {errors.confirmPassword?.message}
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
  );
}
