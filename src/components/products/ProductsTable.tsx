import { Barcode, MoreHorizontal, Edit, Trash, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Item, Product, Service } from "@/types/product";

interface ProductsTableProps {
  items: Item[];
}

export const ProductsTable = ({ items }: ProductsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">Code-barres</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Prix</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="hidden md:table-cell">Dépôt</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.id}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">
                    {item.type === "product" ? "Article" : "Service"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.type === "product" ? (
                    <div className="flex items-center">
                      <Barcode size={16} className="mr-2 text-muted-foreground" />
                      {(item as Product).barcode}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {item.type === "product" ? (
                    <Badge variant="outline">{(item as Product).category}</Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.type === "product"
                    ? `${(item as Product).sellPrice.toLocaleString()} FCFA`
                    : `${(item as Service).amount.toLocaleString()} FCFA`}
                </TableCell>
                <TableCell className="text-center">
                  {item.type === "product" ? (
                    <Badge
                      variant="outline"
                      className={cn(
                        (item as Product).stock === 0
                          ? "text-red-600 border-red-200 bg-red-50"
                          : (item as Product).stock <= (item as Product).minStock
                          ? "text-amber-600 border-amber-200 bg-amber-50"
                          : "text-green-600 border-green-200 bg-green-50"
                      )}
                    >
                      {(item as Product).stock === 0 ? "Épuisé" : (item as Product).stock}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.type === "product" ? (item as Product).depot : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit size={14} className="mr-2" /> Modifier
                      </DropdownMenuItem>
                      {item.type === "product" && (
                        <DropdownMenuItem>
                          <Package size={14} className="mr-2" /> Ajuster le stock
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash size={14} className="mr-2" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Aucun article ou service trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
