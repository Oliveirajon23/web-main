import { createBrowserRouter } from "react-router"
import { Home } from "./pages/app/home"
import { SignIn } from "./pages/auth/sign-in"
import { SignUp } from "./pages/auth/sign-up"
import { FinallyRegister } from "./pages/auth/finally-register"
import { TeacherList } from "./pages/app/teacher-list"
import { TeacherForms } from "./pages/app/teacher-forms"
import { TeacherFormsCompleted } from "./pages/app/teacher-forms-completed"
import { TeacherProfile } from "./pages/app/teacher-profile"

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/sign-up/completed", element: <FinallyRegister /> },
  { path: "/study", element: <TeacherList /> },
  { path: "/give-classes", element: <TeacherForms /> },
  { path: "/give-classes/register-completed", element: <TeacherFormsCompleted /> },
  { path: "/profile", element: <TeacherProfile /> },
])