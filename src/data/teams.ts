import type { TeamDefinition } from "@/types/game";

export const MAX_TEAMS = 6;
export const MIN_TEAMS = 2;

export const TEAM_DEFINITIONS: TeamDefinition[] = [
  {
    slot: 1,
    color: "#C66B57",
    softColor: "#F6E3DD",
    onColor: "#FFFFFF",
  },
  {
    slot: 2,
    color: "#6F93AD",
    softColor: "#E1ECF3",
    onColor: "#FFFFFF",
  },
  {
    slot: 3,
    color: "#7F9F82",
    softColor: "#E4EFE3",
    onColor: "#FFFFFF",
  },
  {
    slot: 4,
    color: "#C89A5B",
    softColor: "#F7EBD7",
    onColor: "#3A2B16",
  },
  {
    slot: 5,
    color: "#9A86B3",
    softColor: "#EEE8F6",
    onColor: "#FFFFFF",
  },
  {
    slot: 6,
    color: "#65A39A",
    softColor: "#DEF0EC",
    onColor: "#FFFFFF",
  },
];

export const DEFAULT_TEAM_NAMES = [
  "Nhóm 1",
  "Nhóm 2",
  "Nhóm 3",
  "Nhóm 4",
  "Nhóm 5",
  "Nhóm 6",
];
