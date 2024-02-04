import { findKeywords } from "./fetchKeyword.ts";
import { getCharacterInspiration } from "./getCharacterInspiration.ts";
import { getRandomName } from "./getRandomName.ts";
import { getWeather } from "./weather.ts";

export default {
  getWeather: getWeather,
  findKeywords: findKeywords,
  getRandomName: getRandomName,
  getCharacterInspiration: getCharacterInspiration,
};
