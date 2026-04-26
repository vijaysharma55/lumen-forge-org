import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-primary">My Documents</h1>
      <Card className="p-10 text-center">
        <FileText className="mx-auto mb-4 h-12 w-12 text-accent" />
        <h3 className="font-display text-lg font-bold text-primary">Document automation coming soon</h3>
        <p className="mt-2 text-sm text-muted-foreground">Receipts, joining letters, ID cards and certificates will be auto-generated and listed here.</p>
      </Card>
    </div>
  );
}
