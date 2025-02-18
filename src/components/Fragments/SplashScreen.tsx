import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SplashScreen() {
  const router = useRouter()
  useEffect(() => {
    const timeOut = setTimeout(() => {
      router.push(`/blogs?page=1`);
    }, 1500);

    return () => clearTimeout(timeOut)  ;
  }, [router]);

  return (
    <main
      className={`flex w-full min-h-screen justify-center items-center bg-gradient-to-br from-sky-400 to-indigo-700`}
    >
      <h1 className="md:text-5xl text-2xl font-bold text-white">
        Welcome to MyBlog
      </h1>
    </main>
  );
}