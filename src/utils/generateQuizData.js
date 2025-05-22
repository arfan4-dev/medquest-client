function generateQuizObject({ name, topics, mode, questionCount, id, isNew }) {
  const currentTime = new Date().toISOString();

  const uniqueTopics = Array.from(new Set(topics));
  return {
    quizId: {
      _id: id,
      name,
      topics: uniqueTopics,
      mode,
      questionsCount: questionCount,
      score: 0,
      status: mode === "Tutor" ? "ongoing" : "paused",
      resumeIndex: 0,
      createdAt: currentTime,
      isNew,
    },
  };
}

export default generateQuizObject;
