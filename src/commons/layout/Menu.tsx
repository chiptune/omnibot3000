import styles from "./Menu.module.css";

import ChatHistory from "@chat/components/ChatHistory";

const Menu = () => {
  return (
    <div className={styles.root}>
      <ChatHistory />
    </div>
  );
};

export default Menu;
