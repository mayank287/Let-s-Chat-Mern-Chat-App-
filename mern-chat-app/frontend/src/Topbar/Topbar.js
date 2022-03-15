import topbar from "topbar";
import { ChatState } from "../Context/ChatProvider";
const TopLoaderBar = () => {
    const {darktheme} = ChatState();
    topbar.config({
        autoRun      : true,
        barThickness : 4,
        barColors    : {
            '0'      : 'purple',
            '.25'    : 'purple',
            '.50'    : 'purple',
            '.75'    : 'purple',
            '1.0'    : 'purple'
        },
         shadowBlur   : 5,
        shadowColor  : 'rgba(0,   0,   0,   .6)'
      })
};

export default TopLoaderBar