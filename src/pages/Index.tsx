
import { 
  Package, 
  Users, 
  CreditCard, 
  ShoppingCart, 
  Truck, 
  TrendingUp,
  BarChart
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar
} from "recharts";

const salesData = [
  { name: "Jan", total: 1800 },
  { name: "Fév", total: 2200 },
  { name: "Mar", total: 2900 },
  { name: "Avr", total: 3100 },
  { name: "Mai", total: 2500 },
  { name: "Juin", total: 3200 },
  { name: "Juil", total: 3800 },
];

const topProductsData = [
  { name: "Smartphone X", value: 54 },
  { name: "Écouteurs sans fil", value: 43 },
  { name: "Chargeur USB", value: 41 },
  { name: "Coque de protection", value: 35 },
  { name: "Carte mémoire", value: 29 },
];

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue dans votre espace de gestion SAMA MAGASIN
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          <DashboardCard
            title="Produits"
            value="127"
            icon={<Package size={20} />}
            trend={{ value: 12, isPositive: true }}
          />
          <DashboardCard
            title="Clients"
            value="84"
            icon={<Users size={20} />}
            trend={{ value: 8, isPositive: true }}
          />
          <DashboardCard
            title="Ventes aujourd'hui"
            value="32 500 FCFA"
            icon={<ShoppingCart size={20} />}
            trend={{ value: 5, isPositive: true }}
          />
          <DashboardCard
            title="Recettes ce mois"
            value="750 000 FCFA"
            icon={<CreditCard size={20} />}
            trend={{ value: 2, isPositive: false }}
          />
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Aperçu des ventes</CardTitle>
              <CardDescription>
                Évolution des ventes sur les 7 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3d8bfa" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3d8bfa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      axisLine={false}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3d8bfa"
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Produits les plus vendus</CardTitle>
              <CardDescription>
                Top 5 des produits vendus ce mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={topProductsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tickLine={false} 
                      axisLine={false}
                      width={120}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="value" 
                      fill="#3d8bfa" 
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Alertes de stock</CardTitle>
              <CardDescription>
                Produits en stock limité ou épuisés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Écouteurs sans fil", status: "Faible", quantity: 5 },
                  { name: "Carte mémoire 128GB", status: "Épuisé", quantity: 0 },
                  { name: "Chargeur rapide", status: "Faible", quantity: 3 },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        item.status === "Faible" ? "bg-amber-500" : "bg-red-500"
                      )} />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.status} ({item.quantity} en stock)
                        </p>
                      </div>
                    </div>
                    <button className="text-xs text-sama-600 font-medium hover:underline">
                      Commander
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Dernières opérations effectuées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Vente", details: "Facture #1234 - 25 000 FCFA", time: "Il y a 15 min" },
                  { type: "Paiement", details: "Versement client - Ibrahim", time: "Il y a 2 heures" },
                  { type: "Stock", details: "Réception commande #89", time: "Il y a 5 heures" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-sama-100 flex items-center justify-center">
                        {item.type === "Vente" && <ShoppingCart size={16} className="text-sama-600" />}
                        {item.type === "Paiement" && <CreditCard size={16} className="text-sama-600" />}
                        {item.type === "Stock" && <Package size={16} className="text-sama-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{item.details}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                    <button className="text-xs text-sama-600 font-medium hover:underline">
                      Voir
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
