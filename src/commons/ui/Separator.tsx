import {ASCII_VLINE} from "@commons/constants";

const Separator = (props: {char?: string}) => (
  <div
    style={{
      flexShrink: 0,
      flexGrow: 0,
      alignSelf: "center",
      justifySelf: "center",
      opacity: "var(--opacity-secondary)",
    }}>{` ${String(props.char || "").trim() || ASCII_VLINE} `}</div>
);

export default Separator;
