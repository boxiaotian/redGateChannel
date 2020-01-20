
import {
    urlEncode
} from "@/utils/utils";
export const redirect_uri = urlEncode(window.location.href);

// let redirect_uri = urlEncode("https://hm.hongmenpd.com/H5/wxauth.php");
