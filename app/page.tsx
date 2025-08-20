import SignUpForm from "@/components/SignUpForm";

export default function Home() {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <h1 className='text-3xl font-bold'>Welcome to dropify</h1>
      <SignUpForm />
    </div>
  );
}
