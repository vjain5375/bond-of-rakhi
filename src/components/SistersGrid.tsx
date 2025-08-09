import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ImagePlus, Upload } from "lucide-react";
import { getLovableUploadUrl } from "@/utils/assets";

export type SisterCategory = "real" | "cousin" | "vow";

export interface Sister {
  id: string;
  name: string;
  category: SisterCategory;
  photo?: string; // data URL
  createdAt: number;
}

const STORAGE_KEY = "rb_sisters";

function loadSisters(): Sister[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

let STORAGE_ERROR_SHOWN = false;
function saveSisters(items: Sister[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save sisters:", err);
    if (!STORAGE_ERROR_SHOWN) {
      STORAGE_ERROR_SHOWN = true;
      toast.error("Storage full: try smaller photos or remove some entries.");
    }
  }
}

const categoryLabels: Record<SisterCategory, string> = {
  real: "Real Sister",
  cousin: "Cousin Sister",
  vow: "Chosen Sister",
};

// User's sisters
const PREFILL_SISTERS: Sister[] = [
  {
    id: "sneha-dido",
    name: "Sneha (Dido)",
    category: "real",
    photo: getLovableUploadUrl("sneha.jpeg"),
    createdAt: Date.now() - 3000,
  },
  {
    id: "shreya-sheru",
    name: "Shreya Bhangi (Sheru Jabali)",
    category: "vow",
    photo: getLovableUploadUrl("shreya bhangi.jpeg"),
    createdAt: Date.now() - 2000,
  },
  {
    id: "kritika-khushi",
    name: "Kritika (Khushi) 🐸",
    category: "cousin",
    photo: getLovableUploadUrl("khushi and sneha.jpeg"),
    createdAt: Date.now() - 1000,
  },
  {
    id: "manasvi",
    name: "Manasvi",
    category: "vow",
    photo: getLovableUploadUrl("manasvi.jpeg"),
    createdAt: Date.now(),
  },
];

// Optimize images before storing to keep localStorage small
async function compressImage(file: File, maxDimension = 1280, quality = 0.7): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = (e) => reject(e);
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    let w = img.width;
    let h = img.height;
    const scale = Math.min(1, maxDimension / Math.max(w, h));
    w = Math.round(w * scale);
    h = Math.round(h * scale);
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

const AddSisterDialog: React.FC<{ onAdd: (s: Sister) => void }>= ({ onAdd }) => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState<SisterCategory>("real");
  const [photo, setPhoto] = React.useState<string | undefined>(undefined);

  const onFile = async (file?: File | null) => {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 1280, 0.72);
      setPhoto(dataUrl);
      toast.success("Photo optimized for storage");
    } catch (e) {
      console.error(e);
      toast.error("Could not process the image");
    }
  };

  const submit = () => {
    if (!name.trim()) {
      toast.error("Please enter a name.");
      return;
    }
    const sister: Sister = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      photo,
      createdAt: Date.now(),
    };
    onAdd(sister);
    setOpen(false);
    setName("");
    setCategory("real");
    setPhoto(undefined);
    toast.success("Sister added locally");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" className="w-full sm:w-auto">Add Sister</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Sister</DialogTitle>
          <DialogDescription id="add-sister-desc">
            Add name, category and an optional photo. Photos are optimized to save space.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sister-name">Name</Label>
            <Input id="sister-name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter name" />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <div className="flex gap-2">
              {(["real","cousin","vow"] as SisterCategory[]).map((c)=> (
                <Button key={c} type="button" variant={category === c ? "default" : "outline"} onClick={()=>setCategory(c)}>
                  {categoryLabels[c]}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-accent">
                <Upload className="size-4" />
                <span>Upload photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e)=>onFile(e.target.files?.[0])} />
              </label>
              {photo ? (
                <img src={photo} alt="Selected" className="size-12 rounded-md object-cover border" />
              ) : (
                <div className="size-12 rounded-md border bg-muted flex items-center justify-center text-muted-foreground">
                  <ImagePlus className="size-5" />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SisterCard: React.FC<{ item: Sister; onDelete: (id: string)=>void }>= ({ item, onDelete }) => {
  const badgeClass = item.category === "real" ? "badge-real" : item.category === "cousin" ? "badge-cousin" : "badge-vow";
  return (
    <Card className="card-elevated overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold truncate">
            {item.name}
          </CardTitle>
          <Badge className={badgeClass}>{categoryLabels[item.category]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-md border">
          {item.photo ? (
            <img src={item.photo} alt={`${item.name} photo`} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
              <ImagePlus className="size-10 animate-float-soft" />
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
};

const SistersGrid: React.FC = () => {
  const [items, setItems] = React.useState<Sister[]>(loadSisters());
  const [tab, setTab] = React.useState<string>("all");

React.useEffect(() => {
  setItems(prev => {
    const names = new Set(prev.map(i => i.name.toLowerCase()));
    const toAdd = PREFILL_SISTERS.filter(p => !names.has(p.name.toLowerCase()));
    return toAdd.length ? [...toAdd, ...prev] : prev;
  });
  // only run once on mount to prefill
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

React.useEffect(()=>{ saveSisters(items) }, [items]);

  const addOne = (s: Sister) => setItems([s, ...items]);
  const removeOne = (id: string) => setItems(items.filter(i=>i.id!==id));

  const filtered = tab === "all" ? items : items.filter(i=> i.category === tab);

  return (
    <section className="mt-10">
      <Tabs value={tab} onValueChange={setTab}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="real">Real</TabsTrigger>
              <TabsTrigger value="cousin">Cousin</TabsTrigger>
              <TabsTrigger value="vow">Chosen Sister</TabsTrigger>
            </TabsList>
          </div>
        <TabsContent value={tab} className="mt-6">
          {filtered.length === 0 ? (
            <div className="text-center text-muted-foreground border rounded-lg p-10">
              No sisters found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item)=> (
                <SisterCard key={item.id} item={item} onDelete={removeOne} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default SistersGrid;
