import { reply } from "../src/util/steemapi.js";

reply("wonsama", "gptbot", "gptbot", "test")
  .then((result) => {
    console.log("result", result);
  })
  .catch((error) => {
    console.log("error", error);
  });
