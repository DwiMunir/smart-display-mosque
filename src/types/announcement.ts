export interface AnnouncementData {
  id: string;
  mosqueId: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high" | "urgent";
  startDate: string;
  endDate: string | null;
  isActive: boolean;
}
