import {
  LayoutDashboard,
  Upload,
  FolderPlus,
  Grid3X3,
  Star,
} from "lucide-react";

export const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Upload Asset",
    path: "/#uploader",
    icon: Upload,
  },
  {
    name: "Create Folder",
    path: "/#folder",
    icon: FolderPlus,
  },
  {
    name: "View Assets",
    path: "/#assets",
    icon: Grid3X3,
  },
  {
    name: "Favourites",
    path: "/favourites",
    icon: Star,
  },
];
