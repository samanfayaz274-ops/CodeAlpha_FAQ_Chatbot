const express = require("express");
const cors = require("cors");
const natural = require("natural");
const faqs = require("./faqs");

const app = express();

app.use(cors());
app.use(express.json());

const tokenizer = new natural.WordTokenizer();

function preprocess(text) {
  return tokenizer.tokenize(text.toLowerCase()).join(" ");
}

app.post("/chat", (req, res) => {
  const { message } = req.body;

  let bestMatch = null;
  let highestScore = 0;

  faqs.forEach((faq) => {
    const score = natural.JaroWinklerDistance(
      preprocess(message),
      preprocess(faq.question)
    );

    if (score > highestScore) {
      highestScore = score;
      bestMatch = faq;
    }
  });

  if (highestScore > 0.5) {
    return res.json({
      answer: bestMatch.answer,
    });
  }

  return res.json({
    answer: "Sorry, I couldn't find a matching answer.",
  });
});

app.get("/", (req, res) => {
  res.send("FAQ Chatbot Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});