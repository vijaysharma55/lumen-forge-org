import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, FileIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  bucket: "ngo-docs" | "receipts";
  userId: string;
  folder?: string; // e.g. "logo" or "documents"
  accept?: string;
  maxFiles?: number;
  label: string;
  description?: string;
}

interface StoredFile { name: string; created_at: string | null; }

export default function FileUploader({ bucket, userId, folder = "files", accept, maxFiles = 10, label, description }: Props) {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const path = `${userId}/${folder}`;

  const load = async () => {
    const { data, error } = await supabase.storage.from(bucket).list(path, { limit: 50, sortBy: { column: "created_at", order: "desc" } });
    if (error) return;
    setFiles((data ?? []).filter((f) => f.name && f.name !== ".emptyFolderPlaceholder"));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [userId, folder, bucket]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("File too large (max 10MB)"); return; }
    if (files.length >= maxFiles) { toast.error(`Max ${maxFiles} files allowed`); return; }
    setUploading(true);
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from(bucket).upload(`${path}/${safeName}`, file, { upsert: false });
    setUploading(false);
    if (e.target) e.target.value = "";
    if (error) return toast.error(error.message);
    toast.success("Uploaded");
    load();
  };

  const remove = async (name: string) => {
    const { error } = await supabase.storage.from(bucket).remove([`${path}/${name}`]);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    load();
  };

  const open = async (name: string) => {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(`${path}/${name}`, 60 * 5);
    if (error || !data) return toast.error("Could not open file");
    window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-display text-sm font-bold text-primary">{label}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleUpload} />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading || files.length >= maxFiles}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload file
        </Button>
        <span className="text-xs text-muted-foreground">{files.length}/{maxFiles}</span>
      </div>
      {files.length > 0 && (
        <ul className="divide-y rounded-lg border">
          {files.map((f) => (
            <li key={f.name} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
              <button onClick={() => open(f.name)} className="flex flex-1 items-center gap-2 text-left hover:text-accent">
                <FileIcon className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{f.name.replace(/^\d+-/, "")}</span>
              </button>
              <Button variant="ghost" size="icon" onClick={() => remove(f.name)} aria-label="Delete">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
