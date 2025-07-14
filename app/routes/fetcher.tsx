import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useFetcher, useSubmit } from "@remix-run/react";
import { useRef } from "react";
import { connectDB } from "~/lib/mongodb";
import User from "~/models/user";

interface User {
  name: string;
  email: string;
}
interface Actiondata {
  success: string;
  error: string;
  user: User;
}
// --- Server Side Logic ---
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");

  await connectDB();
  const user = await User.create({ name, email });
  await user.save();

  return json({ success: true, user });
}

// --- Client Side Page ---
export default function AddUserPage() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const submit = useSubmit();
  const fetcher = useFetcher<Actiondata>();

  // 1️⃣ Manual useSubmit (for custom button)
  const handleManualSubmit = () => {
    const formData = new FormData();
    formData.append("name", nameRef.current?.value || "");
    formData.append("email", emailRef.current?.value || "");
    submit(formData, {
      method: "POST",
      action: "/fetcher",
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">➕ Add User (useSubmit)</h1>

      <input
        ref={nameRef}
        type="text"
        placeholder="Name"
        className="mb-2 block w-full border p-2"
      />
      <input
        ref={emailRef}
        type="email"
        placeholder="Email"
        className="mb-2 block w-full border p-2"
      />
      <button
        onClick={handleManualSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Manually
      </button>

      <hr className="my-6" />

      <h2 className="text-lg font-semibold mb-2">🚀 Add User with fetcher</h2>
      <fetcher.Form method="POST" className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit via fetcher
        </button>
      </fetcher.Form>

      {fetcher.data?.success && (
        <p className="mt-4 text-green-700">
          ✅ User Added: {fetcher.data.user.name} ({fetcher.data.user.email})
        </p>
      )}
    </div>
  );
}
