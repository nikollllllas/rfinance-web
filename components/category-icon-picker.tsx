"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Apple,
  Baby,
  BadgePercent,
  Banknote,
  Beer,
  Bike,
  BookOpen,
  Briefcase,
  Bus,
  Car,
  CircleDollarSign,
  CircleParking,
  Coffee,
  Coins,
  CreditCard,
  Droplets,
  Dumbbell,
  Film,
  Flame,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  HandCoins,
  Heart,
  HeartPulse,
  Home,
  Landmark,
  Laptop,
  Lightbulb,
  type LucideIcon,
  Music,
  Palmtree,
  PawPrint,
  PiggyBank,
  Pill,
  Pizza,
  Plane,
  Receipt,
  Scissors,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  Star,
  Stethoscope,
  Tag,
  Ticket,
  TrainFront,
  TrendingDown,
  TrendingUp,
  Tv,
  Users,
  UtensilsCrossed,
  Wallet,
  Wifi,
  Wrench,
} from "lucide-react";

interface CategoryIconPickerProps {
  icon: string;
  onIconChange: (icon: string) => void;
  disabled?: boolean;
}

type IconOption = { name: string; label: string; icon: LucideIcon };

// `name` é o nome do ícone no lucide.dev, que é o valor salvo na API.
const ICON_GROUPS: Array<{ label: string; icons: IconOption[] }> = [
  {
    label: "Finanças",
    icons: [
      { name: "Wallet", label: "Carteira", icon: Wallet },
      { name: "CircleDollarSign", label: "Dinheiro", icon: CircleDollarSign },
      { name: "Banknote", label: "Cédulas", icon: Banknote },
      { name: "Coins", label: "Moedas", icon: Coins },
      { name: "HandCoins", label: "Pagamento recebido", icon: HandCoins },
      { name: "PiggyBank", label: "Poupança", icon: PiggyBank },
      { name: "CreditCard", label: "Cartão", icon: CreditCard },
      { name: "Landmark", label: "Banco", icon: Landmark },
      { name: "TrendingUp", label: "Investimentos", icon: TrendingUp },
      { name: "TrendingDown", label: "Perdas", icon: TrendingDown },
      { name: "Receipt", label: "Contas e boletos", icon: Receipt },
      { name: "BadgePercent", label: "Impostos e taxas", icon: BadgePercent },
    ],
  },
  {
    label: "Casa",
    icons: [
      { name: "Home", label: "Moradia", icon: Home },
      { name: "Lightbulb", label: "Energia", icon: Lightbulb },
      { name: "Droplets", label: "Água", icon: Droplets },
      { name: "Flame", label: "Gás", icon: Flame },
      { name: "Wifi", label: "Internet", icon: Wifi },
      { name: "Sofa", label: "Móveis", icon: Sofa },
      { name: "Wrench", label: "Manutenção", icon: Wrench },
      { name: "PawPrint", label: "Pets", icon: PawPrint },
    ],
  },
  {
    label: "Alimentação",
    icons: [
      { name: "UtensilsCrossed", label: "Restaurante", icon: UtensilsCrossed },
      { name: "ShoppingCart", label: "Mercado", icon: ShoppingCart },
      { name: "Coffee", label: "Café", icon: Coffee },
      { name: "Pizza", label: "Delivery", icon: Pizza },
      { name: "Beer", label: "Bares", icon: Beer },
      { name: "Apple", label: "Feira", icon: Apple },
    ],
  },
  {
    label: "Transporte",
    icons: [
      { name: "Car", label: "Carro", icon: Car },
      { name: "Fuel", label: "Combustível", icon: Fuel },
      { name: "CircleParking", label: "Estacionamento", icon: CircleParking },
      { name: "Bus", label: "Ônibus", icon: Bus },
      { name: "TrainFront", label: "Metrô e trem", icon: TrainFront },
      { name: "Bike", label: "Bicicleta", icon: Bike },
      { name: "Plane", label: "Viagens", icon: Plane },
    ],
  },
  {
    label: "Saúde e bem-estar",
    icons: [
      { name: "HeartPulse", label: "Saúde", icon: HeartPulse },
      { name: "Pill", label: "Farmácia", icon: Pill },
      { name: "Stethoscope", label: "Consultas", icon: Stethoscope },
      { name: "Dumbbell", label: "Academia", icon: Dumbbell },
      { name: "Scissors", label: "Beleza", icon: Scissors },
      { name: "Baby", label: "Filhos", icon: Baby },
    ],
  },
  {
    label: "Lazer",
    icons: [
      { name: "Gamepad2", label: "Jogos", icon: Gamepad2 },
      { name: "Film", label: "Cinema", icon: Film },
      { name: "Tv", label: "Streaming", icon: Tv },
      { name: "Music", label: "Música", icon: Music },
      { name: "Ticket", label: "Eventos", icon: Ticket },
      { name: "Palmtree", label: "Férias", icon: Palmtree },
    ],
  },
  {
    label: "Compras",
    icons: [
      { name: "ShoppingBag", label: "Compras", icon: ShoppingBag },
      { name: "Shirt", label: "Roupas", icon: Shirt },
      { name: "Smartphone", label: "Eletrônicos", icon: Smartphone },
      { name: "Gift", label: "Presentes", icon: Gift },
      { name: "Sparkles", label: "Cuidados pessoais", icon: Sparkles },
    ],
  },
  {
    label: "Educação e trabalho",
    icons: [
      { name: "GraduationCap", label: "Educação", icon: GraduationCap },
      { name: "BookOpen", label: "Livros e cursos", icon: BookOpen },
      { name: "Briefcase", label: "Trabalho", icon: Briefcase },
      { name: "Laptop", label: "Freelance", icon: Laptop },
    ],
  },
  {
    label: "Outros",
    icons: [
      { name: "Tag", label: "Geral", icon: Tag },
      { name: "Users", label: "Família", icon: Users },
      { name: "Heart", label: "Doações", icon: Heart },
      { name: "Star", label: "Favoritos", icon: Star },
    ],
  },
];

const KNOWN_ICONS = new Set(ICON_GROUPS.flatMap((group) => group.icons.map((option) => option.name)));

// Radix Select não aceita value "", então "sem ícone" usa um sentinela.
const NO_ICON = "__none__";

export function CategoryIconPicker({
  icon,
  onIconChange,
  disabled = false,
}: CategoryIconPickerProps) {
  // Categorias antigas podem ter um nome digitado à mão fora do catálogo: mostra sem perder o valor.
  const isLegacyIcon = Boolean(icon) && !KNOWN_ICONS.has(icon);

  return (
    <Select
      value={icon || NO_ICON}
      onValueChange={(value) => onIconChange(value === NO_ICON ? "" : value)}
      disabled={disabled}
      name="icon"
    >
      <SelectTrigger id="icon">
        <SelectValue placeholder="Selecione um ícone" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        <SelectItem value={NO_ICON}>
          <span className="text-muted-foreground">Sem ícone</span>
        </SelectItem>
        {isLegacyIcon ? <SelectItem value={icon}>{icon}</SelectItem> : null}
        {ICON_GROUPS.map((group) => (
          <SelectGroup key={group.label}>
            <SelectSeparator />
            <SelectLabel>{group.label}</SelectLabel>
            {group.icons.map(({ name, label, icon: IconComponent }) => (
              <SelectItem key={name} value={name}>
                <span className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" aria-hidden="true" />
                  {label}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
