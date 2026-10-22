import SgtClimaInventory from "@/components/SgtClimaInventory";

export const metadata = {
  title: "Gestão de Kits e Ferramentas (SGT Clima) | Plataforma de Climatização",
  description: "Controle de inventário, status de avaria e checklist de infraestrutura técnica com Firebase Firestore.",
};

export default function InventoryPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <SgtClimaInventory />
    </div>
  );
}
