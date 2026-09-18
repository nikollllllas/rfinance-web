"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { previewCategories } from "@/lib/preview-fixtures";

const TYPE_LABEL: Record<string, string> = {
  GANHO: "Ganho",
  GASTO: "Gasto",
  AMBOS: "Ambos",
};

const TYPE_COLOR: Record<string, string> = {
  GANHO: "bg-green-100 text-green-800 hover:bg-green-100/80",
  GASTO: "bg-red-100 text-red-800 hover:bg-red-100/80",
  AMBOS: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
};

export default function PreviewCategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-14 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center px-4 md:px-6">
          <span className="text-lg font-semibold">Categorias</span>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {previewCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden flex flex-col justify-between">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <Badge className={TYPE_COLOR[category.type]}>{TYPE_LABEL[category.type]}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" size="sm" disabled title="Faça login para editar">
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={category.isDefault}
                    title="Faça login para excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
