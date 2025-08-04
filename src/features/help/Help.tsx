import {memo} from "react";

import Container from "@layout/Container";

import styles from "@help/Help.module.css";

import {OmnibotIsSpeaking} from "@chat/components/Message";
import cls from "classnames";

const Help = () => {
  return (
    <div className={styles.root}>
      <Container>
        <div className={cls("text", styles.body)}>
          <OmnibotIsSpeaking
            truth={`help${"\n"}> you will not find any here`}
            hasCaret={true}
          />
        </div>
      </Container>
    </div>
  );
};

export default memo(Help);
