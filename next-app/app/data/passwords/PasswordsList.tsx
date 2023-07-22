import ListItem from "@/components/ListItem";
import usePasswords from "@/hooks/usePasswords";
import PasswordFavIcon from "./PasswordFavIcon";

export default function PasswordsList(props: { searchText: string }) {
  const { passwords, deletePassword } = usePasswords();

  const filteredPasswords = passwords.filter((password) =>
    password.title.toLocaleLowerCase().includes(props.searchText.toLowerCase())
  );

  return (
    <div className="w-full h-full">
      {filteredPasswords.length > 0 ? (
        filteredPasswords.map((password, i) => (
          <ListItem
            title={password.title}
            subTitle={password.username}
            recordId={password.recordId!}
            icon={<PasswordFavIcon websiteUrl={password.websiteUrl} />}
            onDelete={() => {
              console.log(password.recordId);
              if (password.recordId) deletePassword(password.recordId);
            }}
            key={i}
          />
        ))
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <div className="text-lg font-semibold">No Passwords</div>
        </div>
      )}
    </div>
  );
}
