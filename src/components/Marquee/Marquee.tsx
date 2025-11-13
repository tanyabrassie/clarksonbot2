import styles from "./Marquee.module.scss";

export const Marquee = () => {
  return (
    <div>
      {/* @ts-expect-error - marquee is deprecated but works for retro aesthetic */}
    <marquee className={styles.marquee}>
      Build A Bot Now Live! Try It Today! Build A Bot Now Live! Try It Today!
      Build A Bot Now Live! Try It Today! Build A Bot Now Live! Try It Today!
      Build A Bot Now Live! Try It Today! Build A Bot Now Live! Try It Today!
      Build A Bot Now Live! Try It Today! Build A Bot Now Live! Try It Today!
      Build A Bot Now Live! Try It Today! Build A Bot Now Live! Try It Today!
      Build A Bot Now Live! Try It Today! Build A Bot Now Live! Try It Today!
      Build A Bot Now Live! Try It Today! Build A Bot Now Live! Try It Today!
      Build A Bot Now Live! Try It Today! Build A Bot Now Live! Try It Today!
        {/* @ts-expect-error - closing marquee tag */}
    </marquee>
    </div>
  );
};
