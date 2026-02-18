import { ItemMatch } from "../../api";

export const halls: Record<number, string> = {
  1: "Whitney",
  3: "Connecticut",
  5: "McMahon",
  6: "Putnam",
  7: "North",
  15: "Northwest",
  16: "South",
  42: "Towers",
};

export const cardColors = [
  { fill: "#967335", stroke: "#704700" },
  { fill: "#6D8B6C", stroke: "#527751" },
  { fill: "#A15654", stroke: "#6D0B09" },
  { fill: "#5C7180", stroke: "#3A5468" },
  { fill: "#B4AC3E", stroke: "#958B10" },
  { fill: "#797293", stroke: "#5F4F99" },
];

export const DailyValue = {
  calories: 2000,
  protein: 50,
  carbs: 275,
  fat: 78,
};

export const result: ItemMatch[] = [
  { name: "Fried Chicken Nuggets", id: "111037", servings: 2 },
  { name: "Cross Trax French Fries", id: "161069", servings: 0.75 },
  { name: "Corn", id: "171012", servings: 1 },
];
