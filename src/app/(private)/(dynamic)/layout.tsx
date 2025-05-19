export const dynamic = 'force-dynamic';
import "@/app/globals.css";
import FlashMessage from "@/components/ui/FlashMessage";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <FlashMessage />
      {children}
    </>
  );
}
