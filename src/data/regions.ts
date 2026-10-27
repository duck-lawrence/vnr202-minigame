import type { Region } from "@/types/game";

export const REGIONS: Region[] = [
  {
    id: "chien-luoc",
    order: 1,
    name: "Chủ trương chiến lược",
    period: "1939 – 1941",
    description: "Chuyển hướng chiến lược, đặt giải phóng dân tộc lên hàng đầu.",
    image: "/images/regions/chien-luoc.webp",
    accent: "#C66B57",
    softColor: "#F6E3DD",
  },
  {
    id: "chuan-bi",
    order: 2,
    name: "Chuẩn bị lực lượng",
    period: "1940 – 1944",
    description: "Xây dựng lực lượng chính trị, vũ trang và căn cứ địa.",
    image: "/images/regions/chuan-bi.webp",
    accent: "#7F9F82",
    softColor: "#E4EFE3",
  },
  {
    id: "tong-khoi-nghia",
    order: 3,
    name: "Tổng khởi nghĩa",
    period: "Cao trào 1945",
    description: "Kháng Nhật cứu nước và giành chính quyền trong cả nước.",
    image: "/images/regions/tong-khoi-nghia.webp",
    accent: "#C89A5B",
    softColor: "#F7EBD7",
  },
];

export const REGION_BY_ID = Object.fromEntries(
  REGIONS.map((region) => [region.id, region]),
);
