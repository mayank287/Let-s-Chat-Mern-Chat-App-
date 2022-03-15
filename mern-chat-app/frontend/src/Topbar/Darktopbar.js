import topbar from "topbar";

const DarkTopLoaderBar = () => {

    topbar.config({
        autoRun      : true,
        barThickness : 4,
        barColors    : {
            '0'      : 'red',
            '.25'    : 'red',
            '.50'    : 'red',
            '.75'    : 'red',
            '1.0'    : 'red'
        },
         shadowBlur   : 5,
        shadowColor  : 'rgba(0,   0,   0,   .6)'
      })
};

export default DarkTopLoaderBar