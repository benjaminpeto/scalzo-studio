export interface AdminLeadListItem {
  budgetBand: string | null;
  company: string | null;
  createdAt: string;
  email: string | null;
  id: string;
  name: string | null;
  servicesInterest: string[];
  status: string;
}

export interface AdminLeadsListData {
  budgets: string[];
  filteredCount: number;
  leads: AdminLeadListItem[];
  newCount: number;
  query: string;
  selectedBudget: string;
  selectedStatus: string;
  statuses: string[];
  totalCount: number;
}
