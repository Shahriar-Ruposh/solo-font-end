// src/pages/LoginForm.tsx
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "../store/authReducer";
import { RootState } from "../store/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    dispatch(loginUserThunk(data.email, data.password) as any);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}
      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && <p>{errors.password.message}</p>}
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default LoginForm;
