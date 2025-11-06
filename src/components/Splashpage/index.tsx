import "./index.css";
import clarksonBotUrl from "../../assets/clarkson-bot.gif";

export const SplashPage = () => {
  return (
    <div
      className="splash"
      style={{
        // Tile the animated bot as the page background
        backgroundImage: `url(${clarksonBotUrl})`,
      }}
    >
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
