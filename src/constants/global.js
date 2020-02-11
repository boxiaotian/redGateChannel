
import {
  urlEncode
} from "@/utils/utils";

let location = window.location.href;

if (process.env.NODE_ENV === "development") {
  location = "https://hm.hongmenpd.com/H5/wxauth.php"
}

export const redirect_uri = urlEncode(location);
