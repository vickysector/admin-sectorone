"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import "./nav-links.css";
import {
  SafetyOutlined,
  LineChartOutlined,
  BugOutlined,
  HistoryOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import SecurityIcon from "@mui/icons-material/Security";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import ScreenSearchDesktopOutlinedIcon from "@mui/icons-material/ScreenSearchDesktopOutlined";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsApplicationsOutlinedIcon from "@mui/icons-material/SettingsApplicationsOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const links = [
  {
    name: "Users",
    href: "/credentials/dashboard/users",
    hrefDetail: "/credentials/dashboard/users",
    icon: AccountCircleOutlinedIcon,
    breach: false,
  },
  {
    name: "Domain Search",
    href: "/credentials/dashboard/domain-search",
    hrefDetail: "/credentials/dashboard/domain-search",
    icon: DashboardOutlinedIcon,
    breach: false,
  },
  {
    name: "Executive protection",
    href: "/credentials/dashboard/executive-protections",
    icon: SecurityIcon,
    breach: false,
  },
  {
    name: "Activity Log",
    href: "/credentials/dashboard/activity-log",
    icon: HistoryOutlinedIcon,
    breach: false,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  const [ransomwareState, setRansomwareState] = useState(false);

  const ransomwareDropdownSidebar = () => {
    setRansomwareState((prev) => !prev);
  };

  console.log("testing: ", ransomwareState);

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        return !link.breach ? (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center mb-4 py-1.5 px-2 text-center hover:bg-primary-base text-text-description hover:text-white overflow-hidden rounded-lg",
              {
                "bg-primary-base text-white": pathname === link.href,
              },
              {
                "bg-primary-base text-white": pathname.includes(
                  link.hrefDetail
                ),
              }
            )}
          >
            <LinkIcon
              className="link-icon"
              style={{
                fontSize: "20px",
                color: pathname === link.href && "#fff",
              }}
            />
            <p
              className={clsx(
                "ml-3  text-LG-normal hover:text-white text-left flex-grow text-nowrap",
                {
                  "text-white text-LG-strong": pathname === link.href,
                },
                {
                  "text-white text-LG-strong": pathname.includes(
                    link.hrefDetail
                  ),
                }
              )}
            >
              {" "}
              {link.name}{" "}
            </p>
          </Link>
        ) : (
          <div
            className={clsx(
              "overflow-hidden",
              ransomwareState ? "h-auto" : "max-h-[50px]"
            )}
          >
            <section
              className={clsx(
                "flex items-center mb-4 py-1.5 px-2 text-center text-text-description overflow-hidden rounded-lg cursor-pointer "
              )}
              onClick={ransomwareDropdownSidebar}
            >
              <LinkIcon
                className="link-icon"
                style={{
                  fontSize: "20px",
                  color: pathname === link.href && "#fff",
                }}
              />
              <p
                className={clsx(
                  "ml-3  text-LG-normal text-left flex-grow text-nowrap"
                )}
              >
                {" "}
                {link.name}{" "}
              </p>
              <div>
                {ransomwareState ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowUpIcon />
                )}
              </div>
            </section>
            {link.dropdownItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center mb-4 py-1.5 px-2 text-center hover:bg-primary-base text-text-description hover:text-white overflow-hidden rounded-lg transition-all duration-200",
                  {
                    "bg-primary-base text-white": pathname === item.href,
                  },
                  {
                    "bg-primary-base text-white": pathname.includes(
                      item.hrefDetail
                    ),
                  },
                  ransomwareState
                    ? "relative top-0 opacity-100"
                    : "relative top-[-150px] opacity-0"
                )}
              >
                <p
                  className={clsx(
                    "ml-8  text-LG-normal hover:text-white text-left flex-grow text-nowrap",
                    {
                      "text-white text-LG-strong": pathname === item.href,
                    },
                    {
                      "text-white text-LG-strong": pathname.includes(
                        item.hrefDetail
                      ),
                    }
                  )}
                >
                  {" "}
                  {item.name}{" "}
                </p>
              </Link>
            ))}
          </div>
        );
      })}
    </>
  );
}
