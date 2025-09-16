import {memo} from "react";

import {ASCII_COPYRIGHT, ASCII_CURRENCY} from "@commons/constants";
import Breadcrumb from "@layout/Breadcrumb";
import styles from "@layout/Footer.module.css";
import Separator from "@ui/Separator";
import Spacer from "@ui/Spacer";
import {numberToRoman} from "@utils/math";
import {isDev} from "@utils/system";
import VERSION, {AUTHOR, NAME} from "@utils/version";

import useDebug from "@hooks/useDebug";

import {RenderTime} from "@/App";

import cls from "classnames";

const Footer = (props: {renderTime: RenderTime}) => {
  const debug = useDebug();
  return (
    <div className={cls("text", styles.root)}>
      <div className={styles.spacing}>
        <div>
          <span className={styles.copyright}>{ASCII_COPYRIGHT}</span>
          <span className={styles.info}>
            {` ${numberToRoman(Number(new Date().getFullYear()))} `}
          </span>
        </div>
        <a href={AUTHOR.url} target="_blank">
          {AUTHOR.name}
        </a>
      </div>
      <Separator />
      <Breadcrumb />
      <Spacer />
      {isDev() && (
        <>
          <div className={styles.spacing}>
            <span className={styles.info}>{`${props.renderTime.phase}:`}</span>
            <span style={{whiteSpace: "nowrap"}}>
              {props.renderTime.duration.toFixed(1)}
              <span className={styles.info}>ms</span>
            </span>
          </div>
          <Separator />
        </>
      )}
      {debug && <div className={styles.info}>{ASCII_CURRENCY}</div>}
      <div className={styles.spacing}>
        <span className={styles.info}>ver </span>
        <a href={`${AUTHOR.url}/${NAME}`} target="_blank">
          {VERSION.join(".")}
        </a>
      </div>
    </div>
  );
};

export default memo(Footer);
