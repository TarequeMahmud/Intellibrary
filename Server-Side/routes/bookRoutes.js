import express, { response } from "express";
import { Book } from "../models/bookModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAwO-ZyN4OAtDXlJgKS62fjsgIvUiz44VY");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = await Book.find({});
    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    return res.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send("Fill all the fields.");
    }

    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    };
    const book = await Book.create(newBook);
    return res.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({ message: "Fill all the fields." });
    }
    const { id } = req.params;
    const result = await Book.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(400).send({ message: "Book not found" });
    }
    return res.status(201).send({ message: "Book is updated" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Book.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send({ message: "Book not found" });
    }
    res.status(200).send({ message: "Book is deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.post("/analyze", async (req, res) => {
  const { query } = req.body;

  try {
    const books = await Book.find();
    const booksList = books
      .map(
        (book) =>
          `title:${book.title} writer:${book.author}, publishYear${book.publishYear}`
      )
      .join(" \n ");

    const prompt = `Hey, i am intellibrery, an ai helped app. I have these books in my shelf:\n ${booksList}. my client asked me, \n question: "${query}" \n  provide an answer for him. the response should be specific for him not a single word for me. dont ask any question in response. also at the last give the Ids of the books if his question relates to any, under title of 'suggested books' or skip this.`;
    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    res.json(result.response.text());
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
