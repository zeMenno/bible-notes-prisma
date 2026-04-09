import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { SiteHeader } from "@/components/site/site-header";

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <SimpleEditor />
    </div>
  );
}
