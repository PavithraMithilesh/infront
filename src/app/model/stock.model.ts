export interface Stock {
    id?: number | null;
    assignedWatchLists: number[];
    name: string;
    data: string;
    checked: boolean;
    active: boolean;
    numbers: number[]
  }