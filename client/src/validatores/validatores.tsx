import { z } from "zod";

export const gameSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  release_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
  publisher: z.string().min(1, "Publisher is required"),
  thumbnail: z.instanceof(File).optional(),
  genres: z.array(z.string()).nonempty("At least one genre is required"),
});

export type GameFormValues = z.infer<typeof gameSchema>;
