import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const axiosWithToken = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosWithToken.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;

    if (
      (response && response.data.error === "jwt expired") ||
      response.data.error ===
        "Token has been invalidated. Please log in again." ||
      (response && response.status === 401)
    ) {
      const isQuestionRoute = window.location.pathname.includes("/question");

      if (isQuestionRoute) {
        const saveScoreboard = () => {
          const quizId = Object.keys(localStorage).find((key) =>
            key.startsWith("quiz_")
          );

          if (quizId) {
            const scoreboard = JSON.parse(localStorage.getItem(quizId));

            if (scoreboard) {
              const scoreboardData = scoreboard.scoreboard;
              const data = JSON.stringify({
                id: quizId.replace("quiz_", ""),
                scoreboard: scoreboardData,
              });
              const blob = new Blob([data], { type: "application/json" });
              navigator.sendBeacon(
                `${import.meta.env.VITE_API_URL}/quiz/end`,
                blob
              );

              localStorage.removeItem(quizId);
            }
          }
        };

        saveScoreboard();
      }

      localStorage.removeItem("isLoggedIn");
      localStorage.setItem("isLoggingOut", "true");
      setTimeout(() => {
        window.location.href = `${import.meta.env.VITE_FRONTENT_URL}`;
      }, 100);
    }

    return Promise.reject(error);
  }
);

export { apiClient, axiosWithToken };

