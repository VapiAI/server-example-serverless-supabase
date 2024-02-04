interface KeywordParams {
  keyword: string;
  topic?: string;
}

export const findKeywords = async (opts: KeywordParams) => {
  const url = `https://api.datamuse.com/words?ml=${opts.keyword}&topics=${opts.topic}`;
  const response = await fetch(url);
  const data = await response.json();
  const words =
    data.map((item: any) => item.word).slice(0, Math.min(data.length, 10)) ??
    [];
  return words;
};
