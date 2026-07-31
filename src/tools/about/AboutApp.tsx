import { useWindowStore } from "../../app/store/windowStore";
import { XpGroupBox } from "../../components/XpGroupBox/XpGroupBox";
import styles from "./AboutApp.module.css";

type AboutAppProps = {
  windowId: string;
};

const githubUrl = "https://github.com/michal-pod/ecxp";

export function AboutApp({ windowId }: AboutAppProps) {
  const closeWindow = useWindowStore((state) => state.closeWindow);

  return (
    <div className={styles.app}>
      <XpGroupBox title="ElectroCalc XP">
        <div className={styles.content}>
          <div className={styles.logo}>EC</div>
          <div className={styles.text}>
            <p>
              ElectroCalc XP is a small browser-based electronics toolbox with a
              Windows XP-style interface.
            </p>
            <p>
              It started as an experiment in making a quick AI-built utility more
              accessible: open it in a browser, use the calculators, no install
              step required.
            </p>
            <dl>
              <div>
                <dt>Author:</dt>
                <dd>Michał Podsiadlik</dd>
              </div>
              <div>
                <dt>License:</dt>
                <dd>MIT</dd>
              </div>
              <div>
                <dt>GitHub:</dt>
                <dd>
                  <a href={githubUrl} target="_blank" rel="noreferrer">
                    {githubUrl}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </XpGroupBox>

      <div className={`field-row ${styles.actions}`}>
        <button
          type="button"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            closeWindow(windowId);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
