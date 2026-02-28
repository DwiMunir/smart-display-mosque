"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface QuranHadithItem {
  id: string;
  type: "QURAN" | "HADITH";
  textArabic: string;
  textTranslation: string;
  reference: string;
  isActive: boolean;
  sortOrder: number;
}

interface QuranHadithClientProps {
  items: QuranHadithItem[];
}

export function QuranHadithClient({ items: initialItems }: QuranHadithClientProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<QuranHadithItem | null>(null);
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<"QURAN" | "HADITH">("QURAN");
  const [textArabic, setTextArabic] = useState("");
  const [textTranslation, setTextTranslation] = useState("");
  const [reference, setReference] = useState("");
  const [isActive, setIsActive] = useState(true);

  function openCreate() {
    setEditing(null);
    setType("QURAN");
    setTextArabic("");
    setTextTranslation("");
    setReference("");
    setIsActive(true);
    setDialogOpen(true);
  }

  function openEdit(item: QuranHadithItem) {
    setEditing(item);
    setType(item.type);
    setTextArabic(item.textArabic);
    setTextTranslation(item.textTranslation);
    setReference(item.reference);
    setIsActive(item.isActive);
    setDialogOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { type, textArabic, textTranslation, reference, isActive };
      if (editing) {
        const res = await fetch(`/api/quran-hadith/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to update");
        setItems((prev) =>
          prev.map((i) => (i.id === editing.id ? { ...i, ...body } : i))
        );
        toast.success("Updated successfully");
      } else {
        const res = await fetch("/api/quran-hadith", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to create");
        const created = await res.json();
        setItems((prev) => [...prev, created]);
        toast.success("Created successfully");
      }
      setDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/quran-hadith/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit" : "Add"} Quran / Hadith
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as "QURAN" | "HADITH")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QURAN">Quran</SelectItem>
                      <SelectItem value="HADITH">Hadith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. Surah Al-Baqarah 2:255"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="textArabic">Arabic Text</Label>
                <Textarea
                  id="textArabic"
                  value={textArabic}
                  onChange={(e) => setTextArabic(e.target.value)}
                  placeholder="Enter Arabic text..."
                  dir="rtl"
                  className="font-amiri text-lg min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="textTranslation">Translation</Label>
                <Textarea
                  id="textTranslation"
                  value={textTranslation}
                  onChange={(e) => setTextTranslation(e.target.value)}
                  placeholder="Enter translation..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label>Active on display</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="max-w-[300px]">Text</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No items yet. Click &quot;Add New&quot; to get started.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant={item.type === "QURAN" ? "default" : "secondary"}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.reference}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {item.textTranslation}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? "default" : "outline"}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
