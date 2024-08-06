import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import adminrouter from "../src/Modules/Admin/Admin.routes.js";
import userrouter from "../src/Modules/CTHUser/User.routes.js";
import Banner from "../src/Modules/Banner/Banner.routes.js";
import privacy from "../src/Modules/PrivacyPolicy/Privacypolicy.routes.js";
import termscondtion from "../src/Modules/TermAndConditions/Termscondition.routes.js";
import blogs from "../src/Modules/Blog/Blog.routes.js";
import Sliders from "../src/Modules/Slider/Slider.routes.js";
import ReturnPolicy from "../src/Modules/ReturnPolicy/ReturnPolicy.routes.js";
import faqs from "../src/Modules/FAQS/Faq.routes.js";
import testimonials from "../src/Modules/Testimonial/Testimonial.routes.js";
import Gallery from "../src/Modules/Gallery/Gallery.routes.js";
import associatemember from "../src/Modules/Associatemember/Associate.routes.js";
import chatRoutes from "../src/Modules/Chats/Chat.routes.js";
import messageRoutes from "../src/Modules/Mesaage/Message.routes.js";
import investor from "../src/Modules/Investor/Investor.routes.js";

//routes declearetion
app.use("/api/v1/admin", adminrouter);
app.use("/api/v1/user", userrouter);
app.use("/api/v1/Banner", Banner);
app.use("/api/v1/privacy", privacy);
app.use("/api/v1/terms", termscondtion);
app.use("/api/v1/blog", blogs);
app.use("/api/v1/slider", Sliders);
app.use("/api/v1/Returnpolicy", ReturnPolicy);
app.use("/api/v1/faq", faqs);
app.use("/api/v1/testimonial", testimonials);
app.use("/api/v1/gallery", Gallery);
app.use("/api/v1/associate", associatemember);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/investor", investor);

export { app };
