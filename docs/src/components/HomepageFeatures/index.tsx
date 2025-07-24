import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  png: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    png: require("@site/static/img/magic_wand.png").default,
    description: (
      <>
        React-Form-Krafter is built for simplicity and speed. Define your forms
        and validations once, then reuse components effortlessly across your app
        — saving time and avoiding repetition.
      </>
    ),
  },
  {
    title: "Modular and Reusable",
    png: require("@site/static/img/tree.png").default,
    description: (
      <>
        Create highly modular form components. Define
        your elements once and use them anywhere, keeping your code clean,
        consistent, and maintainable.
      </>
    ),
  },
  {
    title: "Full Control for End Users",
    png: require("@site/static/img/control.png").default,
    description: (
      <>
        Krafter lets users customize and extend forms easily, giving complete
        control over behavior and styling — ensuring maximum flexibility to fit
        any need.
      </>
    ),
  },
];

function Feature({ title, png, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center ">
        <img src={png} alt={title} className={styles.featureSvg} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
