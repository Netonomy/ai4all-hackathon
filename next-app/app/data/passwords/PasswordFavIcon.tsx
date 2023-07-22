import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PasswordFavIcon(props: { websiteUrl: string }) {
  const [favIconUrl, setFaviconUrl] = useState("");
  const defaultIcon = "/next.svg";

  async function checkFavicon(website: string) {
    if (props.websiteUrl) {
      let url =
        website.startsWith("http://") || website.startsWith("https://")
          ? website
          : "https://" + website;
      url += "/favicon.ico";

      setFaviconUrl(url);
    } else {
      setFaviconUrl(defaultIcon);
    }
  }

  function handlError() {
    setFaviconUrl(defaultIcon);
  }

  useEffect(() => {
    checkFavicon(props.websiteUrl);
  }, []);

  return (
    <div className="h-10 w-10 min-w-10 relative rounded overflow-hidden">
      {favIconUrl && (
        <Image src={favIconUrl} alt="password logo" fill onError={handlError} />
      )}
    </div>
  );
}
