import express from "express";
import { PrismaClient } from "../generated/prisma/client";

const router = express.Router();
const prisma = new PrismaClient();