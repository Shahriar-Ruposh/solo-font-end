// src/pages/SignUpForm.tsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../store/authReducer";
import { RootState } from "../store/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

type SignUpFormData = z.infer<typeof SignUpSchema>;

const SignUpForm = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    dispatch(registerUserThunk(data.name, data.email, data.password) as any);
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name</label>
          <input {...register("name")} placeholder="Name" />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input {...register("email")} placeholder="Email" />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input {...register("password")} type="password" placeholder="Password" />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input {...register("confirmPassword")} type="password" placeholder="Confirm Password" />
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </>
  );
};

export default SignUpForm;
