import { connectDB } from "./app/config/dbConfig";
import { app, PORT } from "./app/config/serverConfig";
import commonRouter from "./app/routers";

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", commonRouter);

// Start the server
app.get("/", (req, res) => {
  return res.send("Service Working Fine");
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
