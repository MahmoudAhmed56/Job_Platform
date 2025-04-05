import arcjet, {
  detectBot,
  fixedWindow,
  tokenBucket,
  shield,
} from "@arcjet/next";

export {
  detectBot,
  fixedWindow,
  tokenBucket,
  shield,
};

export default arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [],
});