import { ICoordinates } from "@/types/coordinates";

export interface ICitiListItem {
  id: number;
  name: string;
  state: string;
  country: string;
  coord: ICoordinates;
}
