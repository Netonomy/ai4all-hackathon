"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import usePasswords from "@/hooks/usePasswords";
import useWeb5 from "@/hooks/useWeb5";
import { loadingAtom } from "@/state/loadingAtom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup
  .object({
    title: yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required(),
    url: yup.string().required(),
  })
  .required();

type FormData = {
  title: string;
  username: string;
  password: string;
  url: string;
};

export default function CreatePasswordForm(props: { setAddingPassword: any }) {
  const [, setLoading] = useAtom(loadingAtom);
  const { uploadPassword, passwords } = usePasswords();
  const { web5 } = useWeb5();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (web5) {
      setLoading(true);

      uploadPassword({
        title: data.title,
        password: data.password,
        username: data.username,
        websiteUrl: data.url,
      })
        .then(() => {
          props.setAddingPassword(false);
          reset();
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  });

  return (
    <form className="flex flex-col h-full w-full" onSubmit={onSubmit}>
      <div className="flex flex-1 flex-col w-full h-full gap-4">
        <Input placeholder="Title" {...register("title")} />
        <Input placeholder="username" {...register("username")} />
        <Input placeholder="password" {...register("password")} />
        <Input placeholder="url" {...register("url")} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant={"destructive"}
          onClick={() => props.setAddingPassword(false)}
        >
          Cancel
        </Button>

        <Button className="bg-green-600" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
}
