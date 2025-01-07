'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Index() {

  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, [router]);

  return (
    <div className="grid items-center px-8 font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <p className="text-lg">Redirecting you to the home page...</p>
        <p className="mt-2 text-lg">If you are not redirected please click <a href="/home" className="text-primary font-bold">here</a>.</p>
      </main>
    </div>
  );
}
