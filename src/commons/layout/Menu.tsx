import styles from "./Menu.module.css";

import ChatHistory from "@history/ChatHistory";

const Menu = () => {
  return (
    <div className={styles.root}>
      <ChatHistory />
    </div>
  );
};

export default Menu;
