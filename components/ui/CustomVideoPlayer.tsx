// // components/CustomVideoPlayer.tsx
// "use client";

// import React from "react";
// import Plyr from "plyr-react";
// import "plyr-react/plyr.css";

// interface CustomVideoPlayerProps {
//   url: string;
// }

// const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ url }) => {
//   const plyrProps = {
//     source: {
//       type: "video" as "video", // ✅ explicit type fixes TS error
//       sources: [
//         {
//           src: url,
//           provider: "html5",
//         },
//       ],
//     },
//     options: {
//       controls: [
//         "play",
//         "progress",
//         "current-time",
//         "mute",
//         "volume",
//         "fullscreen",
//       ],
//       settings: [], // disables three-dot menu
//       disableContextMenu: true,
//     },
//   };

//   return (
//     <div className="w-full h-auto">
//       <Plyr {...plyrProps} />
//     </div>
//   );
// };

// export default CustomVideoPlayer;
