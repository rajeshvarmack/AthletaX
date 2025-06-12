export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  isExpanded?: boolean;
  isActive?: boolean;
}

export interface Branch {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
}

export interface SportType {
  id: number;
  name: string;
  icon: string;
  isActive: boolean;
}
