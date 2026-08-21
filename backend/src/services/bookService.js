const { ObjectId } = require("mongodb");
const { getDB } = require("../db");
const inMemoryBooks = require("../data/books");

function normalizeBook(book) {
  if (!book) return null;
  return {
    ...book,
    id: book.id ?? book._id,
    _id: book._id ?? book.id,
  };
}

function filterAndSortBooks(books, query = {}) {
  const { page = 1, limit = 10, sort = "title", category, search, available } = query;
  const skip = (Number(page) - 1) * Number(limit);

  let filtered = [...books];

  if (category) {
    filtered = filtered.filter((book) => book.category === category);
  }

  if (available !== undefined) {
    const isAvailable = String(available).toLowerCase() === "true";
    filtered = filtered.filter((book) => book.available === isAvailable);
  }

  if (search) {
    const searchRegex = new RegExp(search, "i");
    filtered = filtered.filter(
      (book) => searchRegex.test(book.title) || searchRegex.test(book.author)
    );
  }

  const sortField = String(sort).replace(/^-/, "");
  const sortDirection = String(sort).startsWith("-") ? -1 : 1;

  filtered.sort((left, right) => {
    const leftValue = left[sortField] ?? "";
    const rightValue = right[sortField] ?? "";
    if (leftValue < rightValue) return -1 * sortDirection;
    if (leftValue > rightValue) return 1 * sortDirection;
    return 0;
  });

  const paginated = filtered.slice(skip, skip + Number(limit));

  return {
    data: paginated.map(normalizeBook),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: filtered.length,
      pages: Math.ceil(filtered.length / Number(limit)) || 1,
    },
  };
}

async function listBooks(query = {}) {
  const db = await getDB();

  if (db.kind === "memory") {
    return filterAndSortBooks(inMemoryBooks, query);
  }

  const { page = 1, limit = 10, sort = "title", category, search, available } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {};
  if (category) filter.category = category;
  if (available !== undefined) filter.available = String(available).toLowerCase() === "true";
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }

  const sortOption = {};
  const sortField = String(sort).replace(/^-/, "");
  const sortDirection = String(sort).startsWith("-") ? -1 : 1;
  sortOption[sortField] = sortDirection;

  const books = await db.collection("books")
    .find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .toArray();

  const total = await db.collection("books").countDocuments(filter);

  return {
    data: books.map(normalizeBook),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
}

async function getBookByIdService(id) {
  const db = await getDB();

  if (db.kind === "memory") {
    const numericId = Number(id);
    return normalizeBook(inMemoryBooks.find((book) => book.id === numericId) || null);
  }

  if (!ObjectId.isValid(id)) return null;

  const book = await db.collection("books").findOne({ _id: new ObjectId(id) });
  return normalizeBook(book);
}

async function createBookService(payload) {
  const db = await getDB();

  if (db.kind === "memory") {
    const nextId = inMemoryBooks.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const newBook = {
      id: nextId,
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryBooks.push(newBook);
    return normalizeBook(newBook);
  }

  const result = await db.collection("books").insertOne({
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const book = await db.collection("books").findOne({ _id: result.insertedId });
  return normalizeBook(book);
}

async function updateBookService(id, payload) {
  const db = await getDB();

  if (db.kind === "memory") {
    const numericId = Number(id);
    const book = inMemoryBooks.find((item) => item.id === numericId);
    if (!book) return null;

    Object.assign(book, payload, { updatedAt: new Date() });
    return normalizeBook(book);
  }

  if (!ObjectId.isValid(id)) return null;

  const objectId = new ObjectId(id);
  await db.collection("books").updateOne(
    { _id: objectId },
    { $set: { ...payload, updatedAt: new Date() } }
  );

  const updatedBook = await db.collection("books").findOne({ _id: objectId });
  return normalizeBook(updatedBook);
}

async function deleteBookService(id) {
  const db = await getDB();

  if (db.kind === "memory") {
    const numericId = Number(id);
    const index = inMemoryBooks.findIndex((item) => item.id === numericId);
    if (index === -1) {
      return { deletedCount: 0 };
    }
    inMemoryBooks.splice(index, 1);
    return { deletedCount: 1 };
  }

  if (!ObjectId.isValid(id)) return { deletedCount: 0 };

  return db.collection("books").deleteOne({ _id: new ObjectId(id) });
}


async function getBookStatsService() {
  const db = await getDB();

  if (db.kind === "memory") {
    return { message: "Aggregation stats are only available in MongoDB mode." };
  }

  const stats = await db.collection("books").aggregate([
    {
      $facet: {
        byCategory: [
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
              avgPrice: { $avg: "$price" },
            },
          },
          { $sort: { count: -1 } },
        ],
        overview: [
          {
            $group: {
              _id: null,
              totalTitles: { $sum: 1 },
              totalStockQuantity: { $sum: "$stock" },
              totalInventoryValue: { $sum: { $multiply: ["$price", "$stock"] } },
              outOfStockCount: {
                $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] },
              },
            },
          },
        ],
      },
    },
  ]).toArray();

  return stats[0];
}

// መጨረሻው ላይ export ማድረጉን አትርሳ:
module.exports = {
  listBooks,
  getBookByIdService,
  createBookService,
  updateBookService,
  deleteBookService,
  getBookStatsService, // <--- እዚች ጋር ተጨምራለች
};

