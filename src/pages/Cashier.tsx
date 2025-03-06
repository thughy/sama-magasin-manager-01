import { useState } from "react";
import { Search, ShoppingCart, Plus, Minus, X, CreditCard, Receipt, Printer } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Données fictives pour les produits
const products = [
  {
    id: "PRD001",
    name: "Smartphone X",
    price: 189000,
    image: "https://placehold.co/100",
    category: "Électronique"
  },
  {
    id: "PRD002",
    name: "Écouteurs sans fil",
    price: 29000,
    image: "https://placehold.co/100",
    category: "Accessoires"
  },
  {
    id: "PRD003",
    name: "Chargeur USB-C",
    price: 8500,
    image: "https://placehold.co/100",
    category: "Accessoires"
  },
  {
    id: "PRD004",
    name: "Coque protection",
    price: 3500,
    image: "https://placehold.co/100",
    category: "Accessoires"
  },
  {
    id: "PRD005",
    name: "Carte mémoire 128GB",
    price: 18500,
    image: "https://placehold.co/100",
    category: "Stockage"
  },
  {
    id: "PRD006",
    name: "Batterie externe",
    price: 25000,
    image: "https://placehold.co/100",
    category: "Accessoires"
  },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Cashier = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [customerID, setCustomerID] = useState<string>("");

  const categories = [...new Set(products.map(product => product.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
      }
    });
  };

  const updateCartItemQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.18; // 18% TVA
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-scale-in">
        {/* Produits */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Caisse</h1>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Rechercher un produit..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover-scale cursor-pointer"
                onClick={() => addToCart(product)}
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-contain"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-sama-600 font-semibold mt-1">{product.price.toLocaleString()} FCFA</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {product.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full h-40 flex items-center justify-center">
                <p className="text-muted-foreground">Aucun produit trouvé.</p>
              </div>
            )}
          </div>
        </div>

        {/* Panier */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  <div className="flex items-center">
                    <ShoppingCart size={18} className="mr-2" />
                    Panier
                  </div>
                </CardTitle>
                {cart.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={clearCart}
                  >
                    Vider
                  </Button>
                )}
              </div>
              <div className="mt-2">
                <Input 
                  placeholder="Chercher/Ajouter un client..." 
                  className="text-sm h-8"
                  value={customerID}
                  onChange={(e) => setCustomerID(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              {cart.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center">
                  <ShoppingCart size={30} className="text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Le panier est vide</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ajoutez des produits en cliquant dessus
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between gap-2 pb-3 border-b">
                      <div className="flex-grow">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.price.toLocaleString()} FCFA</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateCartItemQuantity(item.id, -1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-5 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateCartItemQuantity(item.id, 1)}
                        >
                          <Plus size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-red-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TVA (18%)</span>
                    <span>{tax.toLocaleString()} FCFA</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-lg">{total.toLocaleString()} FCFA</span>
                  </div>

                  <div className="pt-3">
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Mode de paiement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="card">Carte bancaire</SelectItem>
                        <SelectItem value="mobile">Mobile Money</SelectItem>
                        <SelectItem value="transfer">Virement</SelectItem>
                        <SelectItem value="credit">Crédit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                className="flex-1 bg-sama-600 hover:bg-sama-700"
                disabled={cart.length === 0}
              >
                <CreditCard size={16} className="mr-2" />
                Paiement
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                disabled={cart.length === 0}
              >
                <Receipt size={16} className="mr-2" />
                Facture
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={cart.length === 0}
              >
                <Printer size={18} />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cashier;
