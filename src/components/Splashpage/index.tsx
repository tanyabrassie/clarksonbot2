import "./index.scss";
import clarksonBotUrl from "../../assets/clarkson-bot.gif";

export const SplashPage = () => {
  return (
    <div className="splash">
      <h1 className="splash__title">
        <span className="splash__title-word splash__title-word--1">CLARK</span>
        <span className="splash__title-word splash__title-word--2">SON</span>
        <span className="splash__title-word splash__title-word--3">BOT</span>
      </h1>
      <div
        className="splash__bg"
        style={{
          backgroundImage: `url(${clarksonBotUrl})`,
        }}
      />
      <div className="splash__center">
        <img
          className="splash__bot"
          src={clarksonBotUrl}
          alt="Clarkson Bot"
          decoding="async"
        />
      </div>
    </div>
  );
};
