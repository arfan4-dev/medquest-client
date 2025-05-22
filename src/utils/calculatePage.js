function calculatePageNumber(questionIndex, pageSize, isEnd) {
  if (questionIndex < 0 || pageSize <= 0) {
    throw new Error("Invalid question index or page size.");
  }

  if (isEnd) {
    return Math.ceil(questionIndex / pageSize);
  } else {
    return Math.floor(questionIndex / pageSize) + 1;
  }
}

export default calculatePageNumber;
