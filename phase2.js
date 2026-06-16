// ===== SPACE CLICKER v2 - FULL STABLE BUILD =====

(function () {
  const KEY = "space_clicker_v2_save";

  // =========================
  // SAFE TELEGRAM / GUEST MODE
  // =========================

  window.Telegram = window.Telegram || {};
  window.Telegram.WebApp = window.Telegram.WebApp || null;

  const tg = window.Telegram.WebApp;

  window.IS_TELEGRAM = !!(tg && tg.initDataUnsafe && tg.initDataUnsafe.user);

  window.USER = window.IS_TELEGRAM
    ? tg.initDataUnsafe.user
    : { id: "guest", first_name: "Guest", username: "guest" };

  // =========================
  // SAFE GLOBAL STATE (IMPORTANT FIX)
  // =========================

  window.state = window.state || {
    coins: 0,
    energy: 100
  };

  // =========================
  // MODAL SAFE FALLBACK
  // =========================

  window.showModal =
    window.showModal ||
    function (text) {
      console.log("[MODAL]", text);
      alert(text);
    };

  // =========================
  // GLOBAL ERROR PROTECTION
  // =========================

  window.onerror = function (msg) {
    console.log("JS ERROR:", msg);
    return true;
  };

  window.addEventListener("unhandledrejection", function (e) {
    console.log("PROMISE ERROR:", e.reason);
  });

  // =========================
  // SAVE SYSTEM
  // =========================

  const KEY_SAVE = "space_clicker_v2_save";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY_SAVE)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY_SAVE, JSON.stringify(data));
    } catch (e) {}
  }

  let data = load();

  data.coins = data.coins || 0;
  data.energy = data.energy || 100;
  data.lastLogin = data.lastLogin || Date.now();
  data.streak = data.streak || 1;
  data.lastDaily = data.lastDaily || 0;

  // =========================
  // SYNC SYSTEM
  // =========================

  function syncToGame() {
    window.state.coins = data.coins;
    window.state.energy = data.energy;
  }

  function syncFromGame() {
    data.coins = window.state.coins;
    data.energy = window.state.energy;
  }

  // =========================
  // OFFLINE INCOME
  // =========================

  const now = Date.now();
  const diff = Math.min(now - data.lastLogin, 12 * 60 * 60 * 1000);
  const offlineGain = Math.floor(diff / 1000 / 10);

  if (diff > 5000) {
    data.coins += offlineGain;

    window.addEventListener("load", () => {
      setTimeout(() => {
        showModal("💤 Offline income: +" + offlineGain + " coins");
      }, 800);
    });
  }

  // =========================
  // DAILY REWARD
  // =========================

  function checkDaily() {
    const day = 24 * 60 * 60 * 1000;

    if (Date.now() - data.lastDaily > day) {
      data.streak = (data.streak % 7) + 1;
      data.lastDaily = Date.now();

      const reward = 500 * data.streak;
      data.coins += reward;

      window.addEventListener("load", () => {
        setTimeout(() => {
          showModal("🎁 Daily reward day " + data.streak + ": +" + reward);
        }, 1200);
      });
    }
  }

  checkDaily();

  // =========================
  // CLICK SYSTEM (FIXED - MAIN PROBLEM SOLVED)
  // =========================

  document.addEventListener("click", function () {
    window.state.coins += 1;
    data.coins = window.state.coins;

    console.log("+1 coin →", data.coins);
  });

  // =========================
  // CRITICAL TAP
  // =========================

  document.addEventListener("click", function () {
    if (Math.random() < 0.05) {
      window.state.coins += 10;
      data.coins = window.state.coins;

      console.log("CRITICAL TAP!");
    }
  });

  // =========================
  // RANDOM EVENTS
  // =========================

  setInterval(() => {
    if (Math.random() < 0.15) {
      const reward = Math.floor(Math.random() * 500) + 50;

      window.state.coins += reward;
      data.coins = window.state.coins;

      console.log("Cosmic event +" + reward);
    }
  }, 15000);

  // =========================
  // AUTO SAVE
  // =========================

  setInterval(() => {
    syncFromGame();
    save(data);
  }, 5000);

  // =========================
  // START GAME (CRITICAL FIX)
  // =========================

  function startGame() {
    console.log("GAME STARTED");

    syncToGame();

    showModal("🚀 Game Loaded");
  }

  window.addEventListener("load", startGame);
})();