import {RefObject} from "react";
import {useNavigate} from "react-router-dom";

import {
  ASCII_COPYRIGHT,
  ASCII_CURRENCY,
  AUTHOR,
  SOURCE,
  VERSION,
} from "@commons/constants";
import Breadcrumb from "@layout/Breadcrumb";
import styles from "@layout/Footer.module.css";
import Button from "@ui/Button";
import Separator from "@ui/Separator";
import Spacer from "@ui/Spacer";
import {numberToRoman} from "@utils/math";
import {isDev} from "@utils/system";

import useConfig from "@hooks/useConfig";

import {RenderTime} from "@/App";

import cls from "classnames";

const Footer = (props: {renderTime: RefObject<RenderTime>}) => {
  const {phase, duration} = props.renderTime.current;

  const config = useConfig();
  const {debug} = config.getConfig();

  const navigate = useNavigate();

  const versionHandler = () => {
    navigate("/version");
  };

  return (
    <footer className={cls("text", styles.root)}>
      <div className={styles.spacing}>
        <div>
          <span className={styles.copyright}>{ASCII_COPYRIGHT}</span>
          <span className={styles.info}>
            {` ${numberToRoman(Number(new Date().getFullYear()))} `}
          </span>
        </div>
        <a href={SOURCE} target="_blank">
          {AUTHOR.name}
        </a>
      </div>
      <Separator />
      <Breadcrumb />
      <Spacer />
      {isDev() && (
        <>
          <div className={styles.spacing}>
            <span className={styles.info}>{`${phase}:`}</span>
            <span style={{whiteSpace: "nowrap"}}>
              {duration.toFixed(1)}
              <span className={styles.info}>ms</span>
            </span>
          </div>
          <Separator />
        </>
      )}
      {debug && <div className={styles.info}>{ASCII_CURRENCY}</div>}
      <div className={styles.spacing}>
        <span className={styles.info}>ver </span>
        <Button name={VERSION.join(".")} handler={versionHandler} />
      </div>
    </footer>
  );
};

export default Footer;
