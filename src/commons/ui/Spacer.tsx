import {memo} from "react";

const Spacer = () => (
  <div
    style={{
      flexShrink: 1,
      flexGrow: 1,
      alignSelf: "stretch",
    }}></div>
);

export default memo(Spacer);
