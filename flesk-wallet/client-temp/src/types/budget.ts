export interface Budget {
  id: string;
  category: string; // ex: "Courses"
  amount: number;   // budget alloué
  spent: number;    // montant déjà dépensé (calculé à partir des transactions)
  period: 'monthly' | 'weekly';
} 